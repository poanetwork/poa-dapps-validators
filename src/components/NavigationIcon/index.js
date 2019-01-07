import React from 'react'
import { IconAll } from './IconAll'
import { IconSet } from './IconSet'
import { IconPending } from './IconPending'

export const NavigationIcon = ({ icon, networkBranch }) => {
  switch (icon) {
    case 'all':
      return <IconAll networkBranch={networkBranch} />
    case 'set':
      return <IconSet networkBranch={networkBranch} />
    case 'pending':
      return <IconPending networkBranch={networkBranch} />
    default:
      return null
  }
}
