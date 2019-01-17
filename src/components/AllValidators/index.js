/* eslint-disable no-unexpected-multiline */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Validator from '../Validator'
import { Loading } from '../Loading'
import { MainTitle } from '../MainTitle'

export default class AllValidators extends Component {
  constructor(props) {
    super(props)
    this.getMetadataContract = this.getMetadataContract.bind(this)
    this.getProofOfPhysicalAddressContract = this.getProofOfPhysicalAddressContract.bind(this)
    this.getKeysManagerContract = this.getKeysManagerContract.bind(this)
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

      // Get each validator's voting & mining key array (if voting key is present set it as the 1st element)
      let validatorsVotingAndMiningKeys = await Promise.all(
        validators.map((validator, index) => {
          const miningKey = validators[index].address
          return this.getKeysManagerContract()
            .getVotingByMining(validator.address)
            .then(votingKey => {
              const isNotVotingKey =
                votingKey === '0x0000000000000000000000000000000000000000' ||
                votingKey === '0x00' ||
                votingKey === '0x0' ||
                votingKey === '0x'
              return isNotVotingKey ? [miningKey] : [votingKey, miningKey]
            })
        })
      )

      // Get PoPA physical address of validator using voting & mining array
      const addressRegisteredEvents = await popa.getAllAddressRegisteredEvents()
      const getValidatorsPhysicalAddressesPromises = validatorsVotingAndMiningKeys.map(validatorKeys => {
        return popa
          .getPhysicalAddressesOfWalletAddress(validatorKeys[0], addressRegisteredEvents)
          .then(getPhysicalAddressesResult => {
            // If addresses not found and the keys array has an extra element, retry the fetch and return its result
            return getPhysicalAddressesResult === null && validatorKeys.length > 1
              ? popa.getPhysicalAddressesOfWalletAddress(validatorKeys[1], addressRegisteredEvents)
              : getPhysicalAddressesResult
          })
      })
      const validatorsPhysicalAddresses = await Promise.all(getValidatorsPhysicalAddressesPromises)

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
  getKeysManagerContract() {
    return this.props.web3Config.keysManager
  }
  render() {
    const { networkBranch } = this.props
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
          address={validator.address}
          contactEmail={validator.contactEmail}
          createdDate={validator.createdDate}
          expirationDate={validator.expirationDate}
          firstName={validator.firstName}
          fullAddress={validator.fullAddress}
          index={validator.index}
          isCompany={validator.isCompany}
          key={index}
          lastName={validator.lastName}
          licenseId={validator.licenseId}
          metadataContract={this.props.web3Config.metadataContract}
          methodToCall={this.props.methodToCall}
          netId={this.state.netId}
          networkBranch={networkBranch}
          physicalAddresses={validator.physicalAddresses}
          postal_code={validator.postal_code}
          updatedDate={validator.updatedDate}
          us_state={validator.us_state}
        >
          {childrenWithProps}
        </Validator>
      )
    }
    const isValidatorsPage = this.props.methodToCall === 'getAllValidatorsData'
    const validatorsCount = isValidatorsPage
      ? `Total number of validators: <strong>${this.state.validators.length}</strong>`
      : ''

    return this.state.loading ? (
      ReactDOM.createPortal(<Loading networkBranch={networkBranch} />, document.getElementById('loadingContainer'))
    ) : (
      <div className="vl-AllValidators">
        <MainTitle text={this.props.viewTitle} extraText={validatorsCount} />
        {validators.length ? validators : <p>No content to display.</p>}
      </div>
    )
  }
}
