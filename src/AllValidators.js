import React, { Component } from 'react'
import Validator from './Validator'
import Loading from './Loading'

export default class AllValidators extends Component {
  constructor(props) {
    super(props)
    this.getMetadataContract = this.getMetadataContract.bind(this)
    this.getProofOfPhysicalAddressContract = this.getProofOfPhysicalAddressContract.bind(this)
    this.state = {
      validators: [],
      loading: true
    }
    this.getValidatorsData.call(this)
  }
  componentWillMount() {
    const { props } = this
    const { web3Config } = props
    const { netId } = web3Config
    this.setState({ loading: true, netId: netId })
  }
  async getValidatorsData() {
    const netId = this.props.web3Config.netId
    this.getMetadataContract()
      [this.props.methodToCall](netId)
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          data[i].index = i + 1
        }
        return this.augmentValidatorsWithPhysicalAddress(data)
      })
      .then(augmentedValidators => {
        this.setState({
          validators: augmentedValidators,
          loading: false,
          reload: false,
          netId
        })
      })
  }
  async augmentValidatorsWithPhysicalAddress(validators) {
    let augmentedValidators = []

    const popa = this.getProofOfPhysicalAddressContract()
    try {
      if (popa === null) {
        throw new Error(`ProofOfPhysicalAddress not deployed in the current network`)
      }
      const validatorsWalletAddresses = validators.map(validator => validator.address)
      const validatorsPhysicalAddresses = await popa.getPhysicalAddressesOfWalletAddressArray(validatorsWalletAddresses)
      augmentedValidators = validatorsPhysicalAddresses.map((physicalAddresses, index) => {
        const validator = validators[index]
        let validatorPhysicalAddresses
        // If PoPA addresses found, map them to a format known by the UI components.
        // Else, map the physical address from the validator's metadata .
        if (physicalAddresses && physicalAddresses.length > 0) {
          validatorPhysicalAddresses = physicalAddresses.map(physicalAddress => ({
            fullAddress: `${physicalAddress.data.location} ${physicalAddress.data.city}`,
            us_state: physicalAddress.data.state,
            postal_code: physicalAddress.data.zip,
            isConfirmed: physicalAddress.isConfirmed === true
          }))
        } else {
          validatorPhysicalAddresses = [
            {
              fullAddress: validator.fullAddress,
              us_state: validator.us_state,
              postal_code: validator.postal_code,
              isConfirmed: false
            }
          ]
        }

        return Object.assign({}, validator, { physicalAddresses: validatorPhysicalAddresses })
      })
    } catch (e) {
      console.error(
        `Error while augmenting validators with physical addresses from ProofOfPhysicalAddress, using Metadata's physical addresses`,
        e
      )
      // If an error ocurred or PoPA is not available, fallback to mapping the physical address from the validator's metadata
      // without confirmed/unconfirmed information
      augmentedValidators = validators.map(validator => ({
        ...validator,
        physicalAddresses: [
          {
            fullAddress: validator.fullAddress,
            us_state: validator.us_state,
            postal_code: validator.postal_code
          }
        ]
      }))
    }

    return augmentedValidators
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.web3Config.netId !== this.state.netId) {
      this.getValidatorsData.call(this)
      return false
    }
    return true
  }
  getMetadataContract() {
    return this.props.web3Config.metadataContract
  }
  getProofOfPhysicalAddressContract() {
    return this.props.web3Config.proofOfPhysicalAddressContract
  }
  render() {
    const loading = this.state.loading ? <Loading netId={this.state.netId} /> : ''
    const filtered = this.state.validators.filter((validator, index) => {
      return Object.values(validator).some(val =>
        String(val)
          .toLowerCase()
          .includes(this.props.searchTerm)
      )
    })
    let validators = []
    for (let [index, validator] of filtered.entries()) {
      let childrenWithProps = React.Children.map(this.props.children, child => {
        return React.cloneElement(child, { miningkey: validator.address })
      })
      validators.push(
        <Validator
          key={index}
          physicalAddresses={validator.physicalAddresses}
          address={validator.address}
          firstName={validator.firstName}
          lastName={validator.lastName}
          fullAddress={validator.fullAddress}
          us_state={validator.us_state}
          postal_code={validator.postal_code}
          licenseId={validator.licenseId}
          expirationDate={validator.expirationDate}
          createdDate={validator.createdDate}
          updatedDate={validator.updatedDate}
          index={validator.index}
          metadataContract={this.props.web3Config.metadataContract}
          methodToCall={this.props.methodToCall}
        >
          {childrenWithProps}
        </Validator>
      )
    }
    const isValidatorsPage = this.props.methodToCall === 'getAllValidatorsData'
    const validatorsCountObj = (
      <div className="validators-count">
        <span className="validators-count-label">Total number of validators: </span>
        <span className="validators-count-val">{this.state.validators.length}</span>
      </div>
    )
    const validatorsCount = isValidatorsPage ? validatorsCountObj : ''

    const titleContainer = (
      <div className="main-title-container">
        <span className="main-title">{this.props.viewTitle}</span>
        {validatorsCount}
      </div>
    )

    return (
      <div className="container">
        {loading}
        {titleContainer}
        {validators}
      </div>
    )
  }
}
