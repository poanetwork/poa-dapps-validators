import React from 'react'
import { IconCompany } from '../IconCompany'
import { IconNotary } from '../IconNotary'
import { IconNotaryLicense } from '../IconNotaryLicense'

export const ValidatorTitleIcon = ({ type, networkBranch = '' }) => {
  switch (type) {
    case 'company':
      return <IconCompany networkBranch={networkBranch} type={type} />
    case 'notary':
      return <IconNotary networkBranch={networkBranch} type={type} />
    case 'notaryLicense':
      return <IconNotaryLicense networkBranch={networkBranch} type={type} />
    default:
      return null
  }
}
