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
        return this.augmentValidatorsWithPoPAAddress(data)
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
  async augmentValidatorsWithPoPAAddress(validators) {
    const popa = this.getProofOfPhysicalAddressContract()
    if (popa === null) {
      return validators
    }
    // Until everything is done ok, result will be validators
    let augmentedValidators = validators
    try {
      const validatorsWalletAddresses = validators.map(validator => validator.address)
      const validatorsConfirmedAddresses = await popa.getConfirmedAddressesOfWalletAddressArray(
        validatorsWalletAddresses
      )
      augmentedValidators = validatorsConfirmedAddresses.map((confirmedAddresses, index) => {
        let validatorConfirmedAddress = {}
        if (confirmedAddresses !== null && confirmedAddresses.length > 0) {
          validatorConfirmedAddress = {
            fullAddress: `${confirmedAddresses[0].location} ${confirmedAddresses[0].city}`,
            us_state: confirmedAddresses[0].state,
            postal_code: confirmedAddresses[0].zip,
            isAddressConfirmed: true
          }
        }
        return Object.assign({}, validators[index], validatorConfirmedAddress)
      })
    } catch (e) {
      console.error('Error while augmenting validators with confirmed address', e)
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
          isAddressConfirmed={validator.isAddressConfirmed}
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
