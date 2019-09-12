import React from 'react'
import { NavigationLinks } from '../NavigationLinks'
import NetworkSelect from '../NetworkSelect'

export const MobileMenuLinks = ({ onClick, networkBranch, onNetworkChange }) => {
  return (
    <div className={`hd-MobileMenuLinks hd-MobileMenuLinks-${networkBranch}`} onClick={onClick}>
      <NavigationLinks networkBranch={networkBranch} />
      <NetworkSelect networkBranch={networkBranch} onChange={onNetworkChange} />
    </div>
  )
}
