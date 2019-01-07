import React from 'react'
import { NavigationLinks } from '../NavigationLinks'

export const MobileMenuLinks = ({ onClick, networkBranch }) => {
  return (
    <div className={`hd-MobileMenuLinks hd-MobileMenuLinks-${networkBranch}`} onClick={onClick}>
      <NavigationLinks networkBranch={networkBranch} />
    </div>
  )
}
