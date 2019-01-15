import React, { Component } from 'react'
import helpers from '../../utils/helpers'
import { PhysicalAddressValue } from '../PhysicalAddressValue'
import { ValidatorDataPair } from '../ValidatorDataPair'
import { ValidatorTitle } from '../ValidatorTitle'

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
      address,
      children,
      contactEmail,
      createdDate,
      expirationDate,
      firstName,
      index,
      isCompany,
      lastName,
      licenseId,
      netId,
      networkBranch,
      physicalAddresses,
      updatedDate
    } = this.props

    if (netId === helpers.netIdByName('dai') && !createdDate) {
      isCompany = true
    }

    const showAllValidators = this.props.methodToCall === 'getAllValidatorsData'
    const indexAndAddress = showAllValidators ? `#${index}. ${address}` : address
    const fullName = isCompany ? firstName : `${firstName} ${lastName}`
    const titleFirstColumn = isCompany ? 'Company' : 'Notary'
    const titleSecondColumn = isCompany ? '' : 'Notary license'
    const confirmedAddresses = physicalAddresses.filter(a => a.isConfirmed)
    const unconfirmedAddresses = physicalAddresses.filter(a => !a.isConfirmed)
    const addresses = confirmedAddresses.concat(unconfirmedAddresses)

    return (
      <div className="vl-Validator">
        <div className="vl-Validator_Header">
          <div className="vl-Validator_AddressAndHint">
            <div className="vl-Validator_HeaderAddress">{indexAndAddress}</div>
            <div className="vl-Validator_HeaderHint">Wallet Address</div>
          </div>
          {showAllValidators ? null : (
            <div className="vl-Validator_HeaderConfirmations">{this.state.confirmation} confirmations</div>
          )}
        </div>
        <div className="vl-Validator_Body">
          <div className={`vl-Validator_Column`}>
            <ValidatorTitle
              networkBranch={networkBranch}
              text={titleFirstColumn}
              type={isCompany ? 'company' : 'notary'}
            />
            <div className="vl-Validator_InfoList">
              <ValidatorDataPair data={['Full Name', fullName]} />
              {isCompany ? null : (
                <ValidatorDataPair data={['Address', <PhysicalAddressValue addresses={addresses} />]} />
              )}
              {isCompany ? <ValidatorDataPair data={['Contact E-mail', contactEmail]} /> : null}
            </div>
          </div>
          <div className={`vl-Validator_Column`}>
            <ValidatorTitle
              networkBranch={networkBranch}
              text={titleSecondColumn}
              type={isCompany ? '' : 'notaryLicense'}
            />
            <div className="vl-Validator_InfoList">
              {isCompany ? null : <ValidatorDataPair data={['License ID', licenseId]} />}
              {isCompany ? null : <ValidatorDataPair data={['License Expiration', expirationDate]} />}
              <ValidatorDataPair data={['Miner Creation Date', createdDate]} />
              {updatedDate ? <ValidatorDataPair data={['Pending Change Date', updatedDate]} /> : null}
            </div>
          </div>
        </div>
        {children ? <div className="vl-Validator_Footer">{children}</div> : null}
      </div>
    )
  }
}
export default Validator
