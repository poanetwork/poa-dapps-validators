import React, {Component} from 'react';
import Validator from './Validator'
import Loading from './Loading'

export default class AllValidators extends Component {
  constructor(props){
    super(props);
    this.getMetadataContract = this.getMetadataContract.bind(this);
    this.state = {
      validators: [],
      loading: true,
    }
    this.getValidatorsData.call(this);
  }
  componentWillMount() {
    const netId = this.props.web3Config.netId;
    this.setState({loading: true, netId: netId})
  }
  async getValidatorsData() {
    const netId = this.props.web3Config.netId;
    this.getMetadataContract()[this.props.methodToCall](netId).then((data) => {
      this.setState({
        validators: data,
        loading: false,
        reload: false,
        netId
      })
    })
  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.web3Config.netId !== this.state.netId){
      this.getValidatorsData.call(this)
      return false;
    }
    return true;
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
        >
          {childrenWithProps}
        </Validator>
      )
    }
    const isValidatorsPage = this.props.methodToCall == 'getAllValidatorsData';
    const validatorsCountObj = <div className="validators-count">
      <span className="validators-count-label">Total number of validators: </span>
      <span className="validators-count-val">{this.state.validators.length}</span>
    </div>;
    const validatorsCount = isValidatorsPage ? validatorsCountObj : '';
      
    return (<div className="container">
      {loading}
      {validatorsCount}
      {validators}
    </div>)
  }
}
