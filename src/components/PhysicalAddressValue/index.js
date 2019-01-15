import React from 'react'

export const PhysicalAddressValue = ({ addresses, networkBranch = '' }) => {
  return addresses.map((address, index) => {
    let confirmedIcon = null

    if (address.isConfirmed === true || address.isConfirmed === false) {
      const statusIcon = address.isConfirmed ? 'confirmed' : 'unconfirmed'
      const statusIconTitleText = address.isConfirmed ? 'Confirmed Address' : 'Unconfirmed Address'

      confirmedIcon = (
        <i
          className={`vl-PhysicalAddressValue_Icon vl-PhysicalAddressValue_Icon-${statusIcon} vl-PhysicalAddressValue_Icon-${networkBranch}`}
          title={statusIconTitleText}
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
