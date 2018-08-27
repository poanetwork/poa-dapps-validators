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
    const getConfirmedAddressesPromises = validators.map(validator => {
      return popa.getUserConfirmedAddresses(validator.address)
    })
    const confirmedAddresses = await Promise.all(getConfirmedAddressesPromises).then(
      // Map array of tuples from contract to array of single know UI structure
      grouppedConfirmedAddressesByValidator => {
        return grouppedConfirmedAddressesByValidator.map(confirmedAddresses => {
          // If there is an address in the result, map the first one to a known structure
          if (confirmedAddresses.length === 0) {
            return null
          } else {
            const address = confirmedAddresses[0]
            return {
              fullAddress: `${address.location} ${address.city}`,
              us_state: address.state,
              postal_code: address.zip
            }
          }
        })
      }
    )
    // Only augment a validator if PoPA returned a confirmed address
    const augmentedValidators = validators.map((validator, index) => {
      let result = validator
      const confirmedAddressData = confirmedAddresses[index]
      if (confirmedAddressData) {
        result = Object.assign(validator, confirmedAddressData)
        result = Object.assign(validator, {
          isAddressConfirmed: true
        })
      }
      return result
    })
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
