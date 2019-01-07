import Loading from './components/Loading'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import React, { Component } from 'react'
import emailValidator from 'email-validator'
import helpers from './utils/helpers'
import moment from 'moment'
import { constants } from './utils/constants'
import { messages } from './utils/messages'

import './assets/stylesheets/index.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.checkValidation = this.checkValidation.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onChangeFormField = this.onChangeFormField.bind(this)
    this.getKeysManager = this.getKeysManager.bind(this)
    this.getMetadataContract = this.getMetadataContract.bind(this)
    this.getVotingKey = this.getVotingKey.bind(this)
    this.onChangeAutoComplete = address => {
      const form = this.state.form
      form.fullAddress = address
      this.setState({ form })
    }
    this.onSelect = this.onSelectAutocomplete.bind(this)
    this.state = {
      web3Config: {},
      form: {
        fullAddress: '',
        expirationDate: '',
        postal_code: '',
        us_state: '',
        firstName: '',
        lastName: '',
        licenseId: '',
        contactEmail: '',
        isCompany: Number(this.props.web3Config.netId) === helpers.netIdByName('dai')
      },
      hasData: false
    }

    this.defaultValues = null
    this.setMetadata.call(this)

    this.isValidVotingKey = false
    this.setIsValidVotingKey.call(this)
  }
  async setMetadata() {
    const currentData = await this.getMetadataContract().getValidatorData(this.getMiningKey())
    const hasData = currentData.createdDate ? true : false
    this.defaultValues = currentData
    const pendingChange = await this.getMetadataContract().getPendingChange(this.getMiningKey())
    if (Number(pendingChange.minThreshold) > 0) {
      let msg
      if (pendingChange.isCompany) {
        msg = `
          Full name: <b>${pendingChange.firstName}</b> <br/>
          Contact E-mail: <b>${pendingChange.contactEmail}</b> <br/>
        `
      } else {
        msg = `
          First Name: <b>${pendingChange.firstName}</b> <br/>
          Last Name: <b>${pendingChange.lastName}</b> <br/>
          Full Address: <b>${pendingChange.fullAddress}</b> <br/>
          Expiration Date: <b>${pendingChange.expirationDate}</b> <br />
          License ID: <b>${pendingChange.licenseId}</b> <br/>
          US state: <b>${pendingChange.us_state}</b> <br/>
          Zip Code: <b>${pendingChange.postal_code}</b> <br/>
        `
      }
      helpers.generateAlert('warning', 'You have pending changes!', msg)
    }
    this.setState({
      form: {
        fullAddress: currentData.fullAddress,
        expirationDate: currentData.expirationDate,
        postal_code: currentData.postal_code,
        us_state: currentData.us_state,
        firstName: currentData.firstName,
        lastName: currentData.lastName,
        licenseId: currentData.licenseId,
        contactEmail: currentData.contactEmail,
        isCompany: hasData ? currentData.isCompany : this.state.form.isCompany
      },
      hasData
    })
  }
  async setIsValidVotingKey() {
    this.isValidVotingKey = await this.getKeysManager().isVotingActive(this.getVotingKey())
    if (!this.isValidVotingKey) {
      helpers.generateAlert('warning', 'Warning!', messages.invalidaVotingKey)
    }
  }
  getKeysManager() {
    return this.props.web3Config.keysManager
  }
  getMetadataContract() {
    return this.props.web3Config.metadataContract
  }
  getVotingKey() {
    return this.props.web3Config.votingKey
  }
  getMiningKey() {
    return this.props.web3Config.miningKey
  }
  checkValidation() {
    if (this.state.form.isCompany) {
      if (!this.state.form.firstName) {
        this.setState({ loading: false })
        helpers.generateAlert('warning', 'Warning!', `Full name cannot be empty`)
        return false
      }
      if (!emailValidator.validate(this.state.form.contactEmail)) {
        this.setState({ loading: false })
        helpers.generateAlert('warning', 'Warning!', `Contact E-mail is invalid`)
        return false
      }
    } else {
      const keys = Object.keys(this.state.form)
      keys.forEach(key => {
        if (!this.state.form[key]) {
          if (key !== 'contactEmail' && key !== 'isCompany') {
            this.setState({ loading: false })
            helpers.generateAlert('warning', 'Warning!', `${key} cannot be empty`)
            return false
          }
        }
      })
      const isAfter = moment(this.state.form.expirationDate).isAfter(moment())
      if (!isAfter) {
        this.setState({ loading: false })
        helpers.generateAlert('warning', 'Warning!', 'Expiration date should be valid')
        return false
      }
    }
    return true
  }
  async onSelectAutocomplete(data) {
    let place = await geocodeByAddress(data)
    let address_components = {}
    for (var i = 0; i < place[0].address_components.length; i++) {
      var addressType = place[0].address_components[i].types[0]
      switch (addressType) {
        case 'postal_code':
          address_components.postal_code = place[0].address_components[i].short_name
          break
        case 'street_number':
          address_components.street_number = place[0].address_components[i].short_name
          break
        case 'route':
          address_components.route = place[0].address_components[i].short_name
          break
        case 'locality':
          address_components.locality = place[0].address_components[i].short_name
          break
        case 'administrative_area_level_1':
          address_components.administrative_area_level_1 = place[0].address_components[i].short_name
          break
        default:
          break
      }
      let form = this.state.form
      form.fullAddress = `${address_components.street_number} ${address_components.route} ${
        address_components.locality
      }`
      form.us_state = address_components.administrative_area_level_1
      form.postal_code = address_components.postal_code
      this.setState({
        form
      })
    }
  }
  async onClick() {
    this.setState({ loading: true })
    const isFormValid = this.checkValidation()
    if (isFormValid) {
      const votingKey = this.getVotingKey()
      console.log('voting', votingKey)
      const isValid = await this.getKeysManager().isVotingActive(votingKey)
      console.log(isValid)
      if (isValid) {
        await this.sendTxToContract()
      } else {
        this.setState({ loading: false })
        helpers.generateAlert('warning', 'Warning!', messages.invalidaVotingKey)
        return
      }
    }
  }
  async sendTxToContract() {
    this.getMetadataContract()
      .createMetadata({
        firstName: this.state.form.firstName,
        lastName: this.state.form.lastName,
        licenseId: this.state.form.licenseId,
        fullAddress: this.state.form.fullAddress,
        state: this.state.form.us_state,
        zipcode: this.state.form.postal_code,
        expirationDate: moment(this.state.form.expirationDate).unix(),
        contactEmail: this.state.form.contactEmail,
        isCompany: this.state.form.isCompany,
        votingKey: this.getVotingKey(),
        hasData: this.state.hasData
      })
      .then(receipt => {
        console.log(receipt)
        this.setState({ loading: false })
        helpers.generateAlert('success', 'Congratulations!', 'Your metadata was sent!')
      })
      .catch(error => {
        console.error(error.message)
        let errDescription
        if (error.message.includes(constants.userDeniedTransactionPattern))
          errDescription = `Error: ${constants.userDeniedTransactionPattern}`
        else errDescription = error.message
        this.setState({ loading: false })
        var msg = `
          Something went wrong!<br/><br/>
          ${errDescription}
        `
        helpers.generateAlert('error', 'Error!', msg)
      })
  }
  onChangeFormField(event) {
    const field = event.target.id
    let form = this.state.form
    if (field === 'isNotary') {
      form.isCompany = false
    } else if (field === 'isCompany') {
      form.isCompany = true
    } else {
      form[field] = event.target.value
    }
    this.setState({ form })
  }

  render() {
    const netId = Number(this.props.web3Config.netId)
    const { isCompany } = this.state.form

    const classNameHiddenIfNotCoreNetwork = netId !== helpers.netIdByName('core') ? 'display-none' : ''
    const classNameHiddenIfCompany = isCompany ? 'display-none' : ''
    const classNameHiddenIfNotary = !isCompany ? 'display-none' : ''

    if (!this.isValidVotingKey) {
      return null
    }

    const BtnAction = this.state.hasData ? 'Update' : 'Set'
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="custom-container">
        <strong>{formattedSuggestion.mainText}</strong> <small>{formattedSuggestion.secondaryText}</small>
      </div>
    )

    const inputProps = {
      value: this.state.form.fullAddress,
      onChange: this.onChangeAutoComplete,
      id: 'address'
    }
    let loader = this.state.loading ? <Loading /> : ''

    const isDaiNetwork = netId === helpers.netIdByName('dai')

    let createKeyBtn = (
      <div className="create-keys">
        <form className="create-keys-form">
          <div className={`create-keys-form-is-company ${!isDaiNetwork ? 'display-none' : ''}`}>
            <input
              type="radio"
              name="isCompanyRadio"
              id="isNotary"
              checked={!isCompany}
              onChange={this.onChangeFormField}
            />
            <label htmlFor="isNotary">I'm a notary</label>
            <input
              type="radio"
              name="isCompanyRadio"
              id="isCompany"
              checked={isCompany}
              onChange={this.onChangeFormField}
            />
            <label htmlFor="isCompany">I'm a company</label>
          </div>

          <div className="create-keys-form-i">
            <label htmlFor="firstName">{isCompany ? 'Full name' : 'First name'}</label>
            <input type="text" id="firstName" value={this.state.form.firstName} onChange={this.onChangeFormField} />
          </div>
          <div className={`create-keys-form-i ${classNameHiddenIfNotary}`}>
            <label htmlFor="contactEmail">Contact E-mail</label>
            <input
              type="text"
              id="contactEmail"
              value={this.state.form.contactEmail}
              onChange={this.onChangeFormField}
            />
          </div>
          <div className={`create-keys-form-i ${classNameHiddenIfCompany}`}>
            <label htmlFor="lastName">Last name</label>
            <input type="text" id="lastName" value={this.state.form.lastName} onChange={this.onChangeFormField} />
          </div>
          <div className={`create-keys-form-i ${classNameHiddenIfCompany}`}>
            <label htmlFor="licenseId">License id</label>
            <input type="text" id="licenseId" value={this.state.form.licenseId} onChange={this.onChangeFormField} />
          </div>
          <div className={`create-keys-form-i ${classNameHiddenIfCompany}`}>
            <label htmlFor="expirationDate">License expiration</label>
            <input
              type="date"
              id="expirationDate"
              value={this.state.form.expirationDate}
              onChange={this.onChangeFormField}
            />
          </div>
          <div className={`create-keys-form-i ${classNameHiddenIfCompany}`}>
            <label htmlFor="address">Address</label>
            <PlacesAutocomplete onSelect={this.onSelect} inputProps={inputProps} autocompleteItem={AutocompleteItem} />
          </div>
          <div className={`create-keys-form-i ${classNameHiddenIfCompany}`}>
            <label htmlFor="state">State</label>
            <input type="text" id="us_state" value={this.state.form.us_state} onChange={this.onChangeFormField} />
          </div>
          <div className={`create-keys-form-i ${classNameHiddenIfCompany}`}>
            <label htmlFor="zip">Zip code</label>
            <input type="text" id="postal_code" value={this.state.form.postal_code} onChange={this.onChangeFormField} />
          </div>
        </form>
        <button onClick={this.onClick} className="create-keys-button">
          {BtnAction} Metadata
        </button>
        <p className={`create-keys-address-note ${classNameHiddenIfNotCoreNetwork}`}>
          <i className="create-keys-address-note__icon-info" />
          The entered address will be displayed as Unconfirmed and will be used if you don't have Registered Address(es)
          in{' '}
          <a href="https://popa.poa.network/" target="_blank" rel="noopener noreferrer">
            PoPA DApp
          </a>
          . You have to use PoPA to register and confirm your address(es).
        </p>
      </div>
    )

    let content = createKeyBtn
    const titleContainer = (
      <div className="main-title-container no-search-on-top">
        <span className="main-title">{this.props.viewTitle}</span>
      </div>
    )

    return (
      <div className="container">
        {loader}
        {titleContainer}
        {content}
      </div>
    )
  }
}

export default App
