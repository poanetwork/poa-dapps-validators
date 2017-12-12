import React, { Component } from 'react';
import getWeb3 from './getWeb3'
import KeysManager from './contracts/KeysManager.contract';
import MetadataContract from './contracts/Metadata.contract';
import swal from 'sweetalert';
import './index/index.css';
import ReactDOM from 'react-dom';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId } from 'react-places-autocomplete';
import moment from 'moment';
import Metadata from './contracts/Metadata.contract';

const Loading = () => (
  <div className="loading-container">
    <div className="loading">
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
    </div>
  </div>
)

class App extends Component {
  constructor(props){
    super(props);
    this.checkValidation = this.checkValidation.bind(this)
    this.onClick = this.onClick.bind(this);
    this.onChangeFormField = this.onChangeFormField.bind(this);
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
    this.keysManager = null;
    this.metadataContract = null;
    this.votingKey = null;
    this.defaultValues = null;

    getWeb3().then(async (web3Config) => {
      this.keysManager = new KeysManager({
        web3: web3Config.web3Instance
      });
      this.metadataContract = new Metadata({
        web3: web3Config.web3Instance
      })
      this.votingKey = web3Config.defaultAccount;
      const currentData = await this.metadataContract.getValidatorsData(this.votingKey);
      const hasData = Number(currentData.postal_code) > 0 ? true : false
      this.defaultValues = currentData;
      this.setState({
        form: {
          ...currentData
        },
        hasData
      });
    })
    
  }
  checkValidation() {
    const isAfter = moment(this.state.form.expirationDate).isAfter(moment());
    let keys = Object.keys(this.state.form);
    keys.forEach((key) => {
      console.log(key, this.state[key]);
      if(!this.state.form[key]){
        this.setState({loading: false})
        swal("Warning!", `${key} cannot be empty`, "warning");
        return false;
      }
    })
    if(isAfter){
    } else {
      this.setState({loading: false})
      swal("Warning!", "Expiration date should be valid", "warning");
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
      const isValid = await this.keysManager.isVotingActive(this.votingKey);
      if(Number(isValid) !== 1){
        this.setState({loading:false});
        swal("Warning!", "The key is not valid voting Key! Please make sure you have loaded correct voting key in metamask", "warning");
        return;
      }
      if(Number(isValid) === 1){
      //   // add loading screen
        await this.sendTxToContract()
      }

    }
  }
  async sendTxToContract(){
    this.metadataContract.createMetadata({
      firstName: this.state.form.firstName,
      lastName: this.state.form.lastName,
      licenseId: this.state.form.licenseId,
      fullAddress: this.state.form.fullAddress,
      state: this.state.form.us_state,
      zipcode: this.state.form.postal_code,
      expirationDate: moment(this.state.form.expirationDate).unix(),
      votingKey: this.votingKey,
      hasData: this.state.hasData
    }).then((receipt) => {
      console.log(receipt);
      this.setState({loading: false})
      swal("Congratulations!", "Your metadata was sent!", "success");
    }).catch((error) => {
      console.error(error.message);
      this.setState({loading: false})
      var content = document.createElement("div");
      content.innerHTML = `<div>
        Something went wrong!<br/><br/> 
        ${error.message}
      </div>`;
      swal({
        icon: 'error',
        title: 'Error',
        content: content
      });
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
    let createKeyBtn = (<div className="create-keys">
                   <form className="create-keys-inputs">
        <div className="left">
          <label htmlFor="first-name">First name </label>
          <input type="text" id="firstName" value={this.state.form.firstName} onChange={this.onChangeFormField}/>
          <label htmlFor="last-name">Last name</label>
          <input type="text" id="lastName" value={this.state.form.lastName} onChange={this.onChangeFormField}/>
          <label htmlFor="address">Address</label>
          <PlacesAutocomplete onSelect={this.onSelect} inputProps={inputProps} autocompleteItem={AutocompleteItem} />
          <label htmlFor="state">State</label>
          <input type="text" id="us_state" value={this.state.form.us_state} onChange={this.onChangeFormField}/>
        </div>
        <div className="right">
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
