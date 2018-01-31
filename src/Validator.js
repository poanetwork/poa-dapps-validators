import React, {Component} from 'react';

class Validator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    }
    this.props.metadataContract.getConfirmations({miningKey: this.props.address}).then((confirmation) => {
      this.setState({confirmation})
    })
  }
  render(){
    let {
      address,
      firstName,
      lastName,
      fullAddress,
      us_state,
      postal_code,
      licenseId,
      expirationDate,
      createdDate,
      updatedDate,
      children,
    } = this.props;
    let confirmations = this.props.methodToCall === 'getAllValidatorsData' ? '' : <div className="confirmations">
          <div>{this.state.confirmation} confirmations</div>
      </div>
    return(
      <div className="validators-i">
      <div className="validators-header">
        <div className="validators-header--address">{address}</div>
        <div>{confirmations}</div>
        <div>{children}</div>
      </div>
      <div className="validators-body">
        <div className="validators-notary left">
          <p className="validators-title">Notary</p>
          <div className="validators-table">
            <div className="validators-table-i">
              <p>Full Name</p>
              <p>{firstName} {lastName}</p>
            </div>
            <div className="validators-table-i">
              <p>Address</p>
              <p>{fullAddress}</p>
            </div>
            <div className="validators-table-i">
              <p>State</p>
              <p>{us_state}</p>
            </div>
            <div className="validators-table-i">
              <p>Zip Code</p>
              <p>{postal_code}</p>
            </div>
          </div>
        </div>
        <div className="validators-license right">
          <p className="validators-title">Notary license</p>
          <div className="validators-table">
            <div className="validators-table-i">
              <p>License ID</p>
              <p>{licenseId}</p>
            </div>
            <div className="validators-table-i">
              <p>License Expiration</p>
              <p>{expirationDate}</p>
            </div>
            <div className="validators-table-i">
              <p>Miner Creation Date</p>
              <p>{createdDate}</p>
            </div>
            <div className="validators-table-i">
              <p>Pending Change Requested Date</p>
              <p>{updatedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
export default Validator;
