import React, {Component, Children} from 'react';
import Validator from './Validator'
import Loading from './Loading'

export default class AllValidators extends Component {
  constructor(props){
    super(props);
    this.getMetadataContract = this.getMetadataContract.bind(this);
    this.state = {
      validators: [],
      loading: true,
      netId: props.web3Config.metadataContract.netId
    }
    this.getValidatorsData.call(this);
  }
  async getValidatorsData() {
    this.setState({loading: true})
    this.getMetadataContract()[this.props.methodToCall]().then((data) => {
      this.setState({
        validators: data,
        netId: this.props.web3Config.metadataContract.netId,
        loading: false
      })
    })
  }
  componentWillUpdate(nextProps){
    if(nextProps.web3Config.metadataContract.netId !== this.state.netId && !this.state.loading){
      this.getValidatorsData()
    }
  }
  getMetadataContract(){
    return this.props.web3Config.metadataContract;
  }
  render() {
    const loading = this.state.loading ? <Loading netId={this.state.netId} /> : ''
    const filtered = this.state.validators.filter((validator, index) => {
      return Object.values(validator).some( val => 
        String(val).toLowerCase().includes(this.props.searchTerm) 
      );
    })
    let validators = [];
    let confirmations = [];
    for(let [index, validator] of filtered.entries()) {
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
          metadataContract={this.props.web3Config.metadataContract}
          methodToCall={this.props.methodToCall}
        >{childrenWithProps}</Validator>)

    }
    return (<div className="container">
      {loading}
      {validators}
    </div>)
  }
}
