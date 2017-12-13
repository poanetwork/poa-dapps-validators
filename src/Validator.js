import React, {Component, Children} from 'react';

const Validator = ({
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
  children
}) => (
  <div className="validators-i">
  <div className="validators-header">
    <div className="left">
      {address}
    </div>
    <div className="right">
      {children}
    </div>
    
  </div>
  <div className="validators-body">
    <div className="validators-notary left">
      <p className="validators-title">Notary</p>
      <div className="validators-table">
        <div className="validators-table-tr">
          <p className="validators-table-td left">
            Full Name
          </p>
          <p className="validators-table-td right">
            {firstName} {lastName}
          </p>
        </div>
        <div className="validators-table-tr">
          <p className="validators-table-td left">
            Address
          </p>
          <p className="validators-table-td right">
            {fullAddress}
          </p>
        </div>
        <div className="validators-table-tr">
          <p className="validators-table-td left">
            State
          </p>
          <p className="validators-table-td right">
            {us_state}
          </p>
        </div>
        <div className="validators-table-tr">
          <p className="validators-table-td left">
            Zip Code
          </p>
          <p className="validators-table-td right">
            {postal_code}
          </p>
        </div>
      </div>
    </div>
    <div className="validators-license right">
      <p className="validators-title">Notary license</p>
      <div className="validators-table">
        <div className="validators-table-tr">
          <p className="validators-table-td left">
            License ID
          </p>
          <p className="validators-table-td right">
            {licenseId}
          </p>
        </div>
        <div className="validators-table-tr">
          <p className="validators-table-td left">
            License Expiration
          </p>
          <p className="validators-table-td right">
          {expirationDate}
          </p>
        </div>
        <div className="validators-table-tr">
          <p className="validators-table-td left">
            Miner Creation Date
          </p>
          <p className="validators-table-td right">
          {createdDate}
          </p>
        </div>
        <div className="validators-table-tr">
          <p className="validators-table-td left">
            Pending Change Requested Date
          </p>
          <p className="validators-table-td right">
          {updatedDate}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
)
export default Validator;