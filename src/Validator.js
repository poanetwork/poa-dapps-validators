import React, { Component } from 'react'
import ValidatorPhysicalAddresses from './ValidatorPhysicalAddresses'

class Validator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmation: null
    }
    this.props.metadataContract.getConfirmations({ miningKey: this.props.address }).then(confirmation => {
      this.setState({ confirmation: confirmation[0] })
    })
  }

  render() {
    let {
      physicalAddresses,
      address,
      firstName,
      lastName,
      fullAddress,
      us_state,
      postal_code,
      licenseId,
      expirationDate,
      createdDate,
      updatedDate,
      index,
      children
    } = this.props

    const showAllValidators = this.props.methodToCall === 'getAllValidatorsData'

    const confirmations = showAllValidators ? (
      ''
    ) : (
      <div className="validators-header--confirmations">{this.state.confirmation} confirmations</div>
    )

    const indexAndAddress = showAllValidators ? `#${index}. ${address}` : address
    const pendingChangeDate = !updatedDate ? (
      ''
    ) : (
      <div className="validators-table-i">
        <p>Pending Change Date</p>
        <p>{updatedDate}</p>
      </div>
    )

    // If the is no physicalAddress array (info from PoPA), use the validator's
    // metadata to build an array with the corresponding physical address info
    let allPhysicalAddreses = physicalAddresses || [
      {
        fullAddress: fullAddress,
        us_state: us_state,
        postal_code: postal_code,
        isConfirmed: false
      }
    ]

    return (
      <div className="validators-i">
        <div className="validators-header">
          <div>
            <div className="validators-header--address">{indexAndAddress}</div>
            <div className="validators-header--hint">Wallet Address</div>
          </div>
          {confirmations}
        </div>
        <div className="validators-body">
          <div className="validators-notary left">
            <p className="validators-title validators-title--notary">Notary</p>
            <div className="validators-table">
              <div className="validators-table-i">
                <p>Full Name</p>
                <p>
                  {firstName} {lastName}
                </p>
              </div>
              <ValidatorPhysicalAddresses physicalAddresses={allPhysicalAddreses} />
            </div>
          </div>
          <div className="validators-license right">
            <p className="validators-title  validators-title--notary-license">Notary license</p>
            <div className="validators-table">
              <div className="validators-table-i">
                <p>License ID</p>
                <p>{licenseId}</p>
              </div>
              <div className="validators-table-i">
                <p>License Expiration</p>
                <p>{expirationDate}</p>
              </div>
              <div className="validators-table-i">
                <p>Miner Creation Date</p>
                <p>{createdDate}</p>
              </div>
              {pendingChangeDate}
            </div>
          </div>
        </div>
        <div className="validators-footer">{children}</div>
      </div>
    )
  }
}
export default Validator
