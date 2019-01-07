import React, { Component } from 'react'
import ValidatorPhysicalAddresses from '../ValidatorPhysicalAddresses'
import helpers from '../../utils/helpers'

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
      licenseId,
      expirationDate,
      contactEmail,
      isCompany,
      createdDate,
      updatedDate,
      index,
      children,
      netId
    } = this.props

    if (netId === helpers.netIdByName('dai') && !createdDate) {
      isCompany = true
    }

    const validatorsLeftClass = isCompany ? 'validators-company' : 'validators-notary'
    const validatorsRightClass = isCompany ? 'validators-company' : 'validators-license'
    const iconLeftClass = isCompany ? 'validators-title--company' : 'validators-title--notary'
    const iconRightClass = !isCompany ? 'validators-title--notary-license' : ''

    const showAllValidators = this.props.methodToCall === 'getAllValidatorsData'

    const indexAndAddress = showAllValidators ? `#${index}. ${address}` : address

    const confirmationsDiv = !showAllValidators ? (
      <div className="validators-header--confirmations">{this.state.confirmation} confirmations</div>
    ) : (
      ''
    )

    const fullName = isCompany ? firstName : `${firstName} ${lastName}`

    const physicalAddressesDiv = !isCompany ? <ValidatorPhysicalAddresses physicalAddresses={physicalAddresses} /> : ''

    const contactEmailDiv = isCompany ? (
      <div className="validators-table-i">
        <p>Contact E-mail</p>
        <p>{contactEmail}</p>
      </div>
    ) : (
      ''
    )

    const licenseIdDiv = !isCompany ? (
      <div className="validators-table-i">
        <p>License ID</p>
        <p>{licenseId}</p>
      </div>
    ) : (
      ''
    )

    const licenseExpirationDiv = !isCompany ? (
      <div className="validators-table-i">
        <p>License Expiration</p>
        <p>{expirationDate}</p>
      </div>
    ) : (
      ''
    )

    const pendingChangeDateDiv = updatedDate ? (
      <div className="validators-table-i">
        <p>Pending Change Date</p>
        <p>{updatedDate}</p>
      </div>
    ) : (
      ''
    )

    return (
      <div className="validators-i">
        <div className="validators-header">
          <div>
            <div className="validators-header--address">{indexAndAddress}</div>
            <div className="validators-header--hint">Wallet Address</div>
          </div>
          {confirmationsDiv}
        </div>
        <div className="validators-body">
          <div className={`${validatorsLeftClass} left`}>
            <p className={`validators-title ${iconLeftClass}`}>{isCompany ? 'Company' : 'Notary'}</p>
            <div className="validators-table">
              <div className="validators-table-i">
                <p>Full Name</p>
                <p>{fullName}</p>
              </div>
              {physicalAddressesDiv}
              {contactEmailDiv}
            </div>
          </div>
          <div className={`${validatorsRightClass} right`}>
            <p className={`validators-title ${iconRightClass}`}>{!isCompany ? 'Notary license' : ''}</p>
            <div className="validators-table">
              {licenseIdDiv}
              {licenseExpirationDiv}
              <div className="validators-table-i">
                <p>Miner Creation Date</p>
                <p>{createdDate}</p>
              </div>
              {pendingChangeDateDiv}
            </div>
          </div>
        </div>
        <div className="validators-footer">{children}</div>
      </div>
    )
  }
}
export default Validator
