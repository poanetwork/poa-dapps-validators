import React from 'react'

export const CreateKeysAddressNote = ({ networkBranch }) => {
  return (
    <p className={`key-CreateKeysAddressNote key-CreateKeysAddressNote-${networkBranch}`}>
      <i className={`key-CreateKeysAddressNote_InfoIcon key-CreateKeysAddressNote_InfoIcon-${networkBranch}`} />
      The entered address will be displayed as Unconfirmed and will be used if you don't have Registered Address(es) in{' '}
      <a href="https://popa.poa.network/" target="_blank" rel="noopener noreferrer">
        PoPA DApp
      </a>
      . You have to use PoPA to register and confirm your address(es).
    </p>
  )
}
