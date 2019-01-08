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

    const iconLeftClass = isCompany ? 'vl-Validator_Title-company' : 'vl-Validator_Title-notary'
    const iconRightClass = !isCompany ? 'vl-Validator_Title-notary-license' : ''
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
      <div className="vl-Validator_TableRow">
        <p className="vl-Validator_TableCol">Contact E-mail</p>
        <p className="vl-Validator_TableCol">{contactEmail}</p>
      </div>
    ) : (
      ''
    )
    const licenseIdDiv = !isCompany ? (
      <div className="vl-Validator_TableRow">
        <p className="vl-Validator_TableCol">License ID</p>
        <p className="vl-Validator_TableCol">{licenseId}</p>
      </div>
    ) : (
      ''
    )
    const licenseExpirationDiv = !isCompany ? (
      <div className="vl-Validator_TableRow">
        <p className="vl-Validator_TableCol">License Expiration</p>
        <p className="vl-Validator_TableCol">{expirationDate}</p>
      </div>
    ) : (
      ''
    )
    const pendingChangeDateDiv = updatedDate ? (
      <div className="vl-Validator_TableRow">
        <p className="vl-Validator_TableCol">Pending Change Date</p>
        <p className="vl-Validator_TableCol">{updatedDate}</p>
      </div>
    ) : (
      ''
    )

    return (
      <div className="vl-Validator">
        <div className="vl-Validator_Header">
          <div>
            <div className="vl-Validator_HeaderAddress">{indexAndAddress}</div>
            <div className="vl-Validator_HeaderHint">Wallet Address</div>
          </div>
          {confirmationsDiv}
        </div>
        <div className="vl-Validator_Body">
          <div className={`vl-Validator_Column`}>
            <h3 className={`vl-Validator_Title ${iconLeftClass}`}>{isCompany ? 'Company' : 'Notary'}</h3>
            <div className="vl-Validator_Table">
              <div className="vl-Validator_TableRow">
                <p className="vl-Validator_TableCol">Full Name</p>
                <p className="vl-Validator_TableCol">{fullName}</p>
              </div>
              {physicalAddressesDiv}
              {contactEmailDiv}
            </div>
          </div>
          <div className={`vl-Validator_Column`}>
            <h3 className={`vl-Validator_Title ${iconRightClass}`}>{!isCompany ? 'Notary license' : ''}</h3>
            <div className="vl-Validator_Table">
              {licenseIdDiv}
              {licenseExpirationDiv}
              <div className="vl-Validator_TableRow">
                <p className="vl-Validator_TableCol">Miner Creation Date</p>
                <p className="vl-Validator_TableCol">{createdDate}</p>
              </div>
              {pendingChangeDateDiv}
            </div>
          </div>
        </div>
        {children ? <div className="vl-Validator_Footer">{children}</div> : null}
      </div>
    )
  }
}
export default Validator
