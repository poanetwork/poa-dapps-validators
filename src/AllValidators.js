import React, {Component, Children} from 'react';
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
    this.getMetadataContract()[this.props.methodToCall]().then((data) => {
      this.setState({
        validators: data
      })
    })
  }
  getMetadataContract(){
    return this.props.web3Config.metadataContract;
  }
  render() {

    const filtered = this.state.validators.filter((validator, index) => {
      return Object.values(validator).some( val => 
        String(val).toLowerCase().includes(this.props.searchTerm) 
      );
    })
    let validators = [];
    filtered.forEach((validator, index) => {
      let childrenWithProps = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { miningkey: validator.address });
      })
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
        >{childrenWithProps}</Validator>)
    })
    return (<div className="container">
      {validators}
    </div>)
  }
}
