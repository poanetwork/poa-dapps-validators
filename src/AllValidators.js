import React, {Component} from 'react';
import Validator from './Validator'

export default class AllValidators extends Component {
  constructor(props){
    super(props);
    this.getMetadataContract = this.getMetadataContract.bind(this);
    this.state = {
      validators: []
    }
    this.getValidatorsData.call(this);
  }
  async getValidatorsData() {
    this.getMetadataContract().getAllValidatorsData().then((data) => {
      this.setState({
        validators: data
      })
    })
  }
  getMetadataContract(){
    return this.props.web3Config.metadataContract;
  }
  render() {
    let validators = [];
    this.state.validators.forEach((validator, index) => {
      validators.push(
        <Validator
          key={index}
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
        />)
    })
    return (<div className="container">
      {validators}
    </div>)
  }
}
