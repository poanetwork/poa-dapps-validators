import React, { Component } from 'react';
import './stylesheets/application.css';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import moment from 'moment';
import Loading from './Loading';
import { messages } from './messages';
import helpers from './helpers';

class App extends Component {
  constructor(props){
    super(props);
    this.checkValidation = this.checkValidation.bind(this)
    this.onClick = this.onClick.bind(this);
    this.onChangeFormField = this.onChangeFormField.bind(this);
    this.getKeysManager = this.getKeysManager.bind(this);
    this.getMetadataContract = this.getMetadataContract.bind(this);
    this.getVotingKey = this.getVotingKey.bind(this);
    this.onChangeAutoComplete = ((address) => {
      const form = this.state.form;
      form.fullAddress = address;
      this.setState({form})
    })
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
        licenseId: ''
      },
      hasData: false

    }

    this.defaultValues = null;
    this.setMetadata.call(this);

  }
  async setMetadata(){
    const currentData = await this.getMetadataContract().getValidatorData({votingKey: this.getVotingKey()});
    const hasData = Number(currentData.postal_code) > 0 ? true : false
    this.defaultValues = currentData;
    const pendingChange = await this.getMetadataContract().getPendingChange({votingKey: this.getVotingKey()});
    if(Number(pendingChange.minThreshold) > 0 ) {
      var msg = `
        First Name: ${pendingChange.firstName} <br/>
        Last Name: ${pendingChange.lastName} <br/>
        Full Address: ${pendingChange.fullAddress} <br/>
        Expiration Date: ${pendingChange.expirationDate} <br />
        License ID: ${pendingChange.licenseId} <br/>
        US state: ${pendingChange.us_state} <br/>
        Zip Code: ${pendingChange.postal_code} <br/>
      `;
      helpers.generateAlert("warning", "You have pending changes!", msg);
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
      },
      hasData
    });
  }
  getKeysManager(){
    return this.props.web3Config.keysManager;
  }
  getMetadataContract(){
    return this.props.web3Config.metadataContract;
  }
  getVotingKey(){
    return this.props.web3Config.votingKey;
  }
  checkValidation() {
    const isAfter = moment(this.state.form.expirationDate).isAfter(moment());
    let keys = Object.keys(this.state.form);
    keys.forEach((key) => {
      if(!this.state.form[key]){
        this.setState({loading: false})
        helpers.generateAlert("warning", "Warning!", `${key} cannot be empty`);
        return false;
      }
    })
    if(isAfter){
    } else {
      this.setState({loading: false})
      helpers.generateAlert("warning", "Warning!", "Expiration date should be valid");
      return false;
    }
    return true;
  }
  async onSelectAutocomplete(data) {
    let place = await geocodeByAddress(data)
    let address_components = {};
    for (var i = 0; i < place[0].address_components.length; i++) {
      var addressType = place[0].address_components[i].types[0];
      switch(addressType) {
        case "postal_code":
          address_components.postal_code = Number(place[0].address_components[i].short_name);
          break;
        case "street_number":
          address_components.street_number = place[0].address_components[i].short_name;
          break;
        case "route":
          address_components.route = place[0].address_components[i].short_name;
          break;
        case "locality":
          address_components.locality = place[0].address_components[i].short_name;
          break;
        case "administrative_area_level_1":
          address_components.administrative_area_level_1 = place[0].address_components[i].short_name;
          break;
        default:
          break;
      }
      let form = this.state.form;
      form.fullAddress= `${address_components.street_number} ${address_components.route} ${address_components.locality}`;
      form.us_state= address_components.administrative_area_level_1;
      form.postal_code= address_components.postal_code;
      this.setState({
        form
      });
    }
  }
  async onClick() {
    this.setState({loading:true});
    const isFormValid = this.checkValidation();
    if(isFormValid){
      const votingKey = this.getVotingKey();
      console.log('voting', votingKey)
      const isValid = await this.getKeysManager().isVotingActive(votingKey);
      console.log(isValid);
      if(isValid){
      //   // add loading screen
        await this.sendTxToContract()
      } else {
        this.setState({loading:false});
        helpers.generateAlert("warning", "Warning!", messages.invalidaVotingKey);
        return;
      }

    }
  }
  async sendTxToContract(){
    this.getMetadataContract().createMetadata({
      firstName: this.state.form.firstName,
      lastName: this.state.form.lastName,
      licenseId: this.state.form.licenseId,
      fullAddress: this.state.form.fullAddress,
      state: this.state.form.us_state,
      zipcode: this.state.form.postal_code,
      expirationDate: moment(this.state.form.expirationDate).unix(),
      votingKey: this.getVotingKey(),
      hasData: this.state.hasData
    }).then((receipt) => {
      console.log(receipt);
      this.setState({loading: false})
      helpers.generateAlert("success", "Congratulations!", "Your metadata was sent!");
    }).catch((error) => {
      console.error(error.message);
      this.setState({loading: false})
      var msg = `
        Something went wrong!<br/><br/>
        ${error.message}
      `;
      helpers.generateAlert("error", "Error!", msg);
    })
  }
  onChangeFormField(event) {
    const field = event.target.id;
    const value = event.target.value;
    let form = this.state.form;
    form[field] = value;
    this.setState({form});
  }
  render() {
    const BtnAction = this.state.hasData ? "Update" : "Set";
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="custom-container">
        <strong>{ formattedSuggestion.mainText }</strong>{' '}
        <small>{ formattedSuggestion.secondaryText }</small>
      </div>
    )

    const inputProps = {
      value: this.state.form.fullAddress,
      onChange: this.onChangeAutoComplete,
      id: 'address'
    }
    let loader = this.state.loading ? <Loading /> : '';
    let createKeyBtn = (
      <div className="create-keys">
        <form className="create-keys-form">
          <div className="create-keys-form-i">
            <label htmlFor="first-name">First name</label>
            <input type="text" id="firstName" value={this.state.form.firstName} onChange={this.onChangeFormField}/>
            <label htmlFor="last-name">Last name</label>
            <input type="text" id="lastName" value={this.state.form.lastName} onChange={this.onChangeFormField}/>
            <label htmlFor="address">Address</label>
            <PlacesAutocomplete onSelect={this.onSelect} inputProps={inputProps} autocompleteItem={AutocompleteItem} />
            <label htmlFor="state">State</label>
            <input type="text" id="us_state" value={this.state.form.us_state} onChange={this.onChangeFormField}/>
          </div>
          <div className="create-keys-form-i">
            <label htmlFor="zip">Zip code</label>
            <input type="number" id="postal_code" value={this.state.form.postal_code} onChange={this.onChangeFormField}/>
            <label htmlFor="licenseId">License id</label>
            <input type="text" id="licenseId" value={this.state.form.licenseId} onChange={this.onChangeFormField}/>
            <label htmlFor="expirationDate">License expiration</label>
            <input type="date" id="expirationDate" value={this.state.form.expirationDate} onChange={this.onChangeFormField}/>
          </div>
        </form>
        <button onClick={this.onClick} className="create-keys-button">{BtnAction} Metadata</button>
      </div>)
    let content = createKeyBtn;
    return (
      <div className="container">
        {loader}
        {content}
      </div>
    );
  }
}

export default App;
