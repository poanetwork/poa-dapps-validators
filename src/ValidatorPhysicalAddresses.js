import React from 'react'

const ICON_CONFIRMED_CLASSNAME = 'data-icon--confirmed'
const ICON_UNCONFIRMED_CLASSNAME = 'data-icon--unconfirmed'
const ICON_CONFIRMED_TOOLTIP = 'Confirmed Address'
const ICON_UNCONFIRMED_TOOLTIP = 'Unconfirmed Address'

const ValidatorPhysicalAddress = ({ physicalAddresses }) => {
  const confirmedAddresses = physicalAddresses.filter(a => a.isConfirmed)
  const unconfirmedAddresses = physicalAddresses.filter(a => !a.isConfirmed)
  let addresses = confirmedAddresses.concat(unconfirmedAddresses)

  let singleOrMultiple =
    addresses.length > 1 ? 'validator-physical-address--multiple' : 'validator-physical-address--single'
  let validatorPhysicalAddressClassName = `validators-table-i validator-physical-address ${singleOrMultiple}`

  return (
    <div className={validatorPhysicalAddressClassName}>
      <p className="validator-physical-address__title">Address</p>
      <PhysicalAddressValue addresses={addresses} />
    </div>
  )
}

const PhysicalAddressValue = ({ addresses }) => {
  let textAlign = addresses.length > 1 ? 'text-align-left' : 'text-align-right'
  let physicalAddressValueClassName = `validator-physical-address__value text-capitalized ${textAlign}`

  return addresses.map((address, index) => {
    const iconProps = {
      className: address.isConfirmed ? ICON_CONFIRMED_CLASSNAME : ICON_UNCONFIRMED_CLASSNAME,
      title: address.isConfirmed ? ICON_CONFIRMED_TOOLTIP : ICON_UNCONFIRMED_TOOLTIP
    }
    return (
      <p className={physicalAddressValueClassName} key={index}>
        {`${address.fullAddress} `}
        <span className="text-whitespace-nowrap">{`${address.us_state.toUpperCase()}, ${address.postal_code}`}</span>
        <i {...iconProps} />
      </p>
    )
  })
}

export default ValidatorPhysicalAddress
