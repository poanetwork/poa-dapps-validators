import React from 'react'
import { LogoDai } from '../LogoDai'
import { LogoPOA } from '../LogoPOA'
import { LogoSokol } from '../LogoSokol'
import { constants } from '../../utils/constants'

export const Logo = ({ href = null, extraClass = '', networkBranch = '' }) => {
  switch (networkBranch) {
    case constants.branches.SOKOL:
      return <LogoSokol href={href} extraClass={extraClass} />
    case constants.branches.DAI:
      return <LogoDai href={href} extraClass={extraClass} />
    case constants.branches.CORE:
    default:
      return <LogoPOA href={href} extraClass={extraClass} />
  }
}
