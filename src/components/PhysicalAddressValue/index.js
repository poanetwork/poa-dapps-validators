import React from 'react'

export const PhysicalAddressValue = ({ addresses }) => {
  return addresses.map((address, index) => {
    let confirmedIcon = null

    if (address.isConfirmed === true || address.isConfirmed === false) {
      confirmedIcon = (
        <i
          className={`vl-PhysicalAddressValue_Icon ${
            address.isConfirmed ? 'vl-PhysicalAddressValue_Icon-confirmed' : 'vl-PhysicalAddressValue_Icon-unconfirmed'
          }`}
          title={address.isConfirmed ? 'Confirmed Address' : 'Unconfirmed Address'}
        />
      )
    }

    return (
      <span className="vl-PhysicalAddressValue" key={index}>
        <span className="vl-PhysicalAddressValue_Address">{`${
          address.fullAddress
        }, ${address.us_state.toUpperCase()}, ${address.postal_code}`}</span>
        {confirmedIcon}
      </span>
    )
  })
}
