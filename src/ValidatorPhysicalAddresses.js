import React from 'react'

const CONFIRMED_ADDRESS_TITLE = 'Confirmed Address'
const UNCONFIRMED_ADDRESS_TITLE = 'Unconfirmed Address'

const ValidatorPhysicalAddress = ({ physicalAddresses }) => {
  const confirmedAddresses = physicalAddresses.filter(a => a.isConfirmed)
  const unconfirmedAddresses = physicalAddresses.filter(a => !a.isConfirmed)
  const hasConfirmedAddresses = confirmedAddresses.length > 0

  const baseTitle = hasConfirmedAddresses ? CONFIRMED_ADDRESS_TITLE : UNCONFIRMED_ADDRESS_TITLE
  const addresses = hasConfirmedAddresses ? confirmedAddresses : unconfirmedAddresses

  let renderedResult = null
  if (addresses.length > 1) {
    renderedResult = addresses.map((address, index) => {
      return (
        <div className="validators-table-i" key={index}>
          <p>{`${baseTitle} #${index + 1}`}</p>
          <PhysicalAddressValue address={address} />
        </div>
      )
    })
  } else {
    renderedResult = (
      <div className="validators-table-i">
        <p>{baseTitle}</p>
        <PhysicalAddressValue address={addresses[0]} />
      </div>
    )
  }
  return renderedResult
}

const PhysicalAddressValue = ({ address }) => {
  const { fullAddress, us_state, postal_code } = address
  return (
    <p className="text-capitalized text-align-right">
      {`${fullAddress},`}
      <br />
      {`${us_state.toUpperCase()}, ${postal_code}`}
    </p>
  )
}

export default ValidatorPhysicalAddress
