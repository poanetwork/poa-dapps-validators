import React from 'react'
import Select from 'react-select'
import logoBase from './images/logos/logo_validators_dapp@2x.png'
import logoSokol from './images/logos/logo_sokol@2x.png'
import menuIconBase from './images/icons/icon-menu.svg'
import menuIconSokol from './images/icons/icon-menu-sokol.svg'
import menuOpenIconBase from './images/icons/icon-close.svg'
import menuOpenIconSokol from './images/icons/icon-close-sokol.svg'
import NavigationLinks from './NavigationLinks'
import MobileMenuLinks from './MobileMenuLinks'
import { constants } from './constants'

const Header = ({ netId, onChange, injectedWeb3, showMobileMenu, onMenuToggle, baseRootPath, navigationData }) => {
  const thisIsTestnet = netId in constants.NETWORKS && constants.NETWORKS[netId].TESTNET
  const headerClassName = thisIsTestnet ? 'sokol' : ''
  const logoImageName = thisIsTestnet ? logoSokol : logoBase
  const menuIcon = thisIsTestnet ? menuIconSokol : menuIconBase
  const menuOpenIcon = thisIsTestnet ? menuOpenIconSokol : menuOpenIconBase

  let select
  let options = []

  for (const _netId in constants.NETWORKS) {
    options.push({ value: _netId, label: `Network: ${constants.NETWORKS[_netId].NAME}` })
  }

  if (!injectedWeb3) {
    select = (
      <Select
        id="netId"
        value={netId}
        onChange={onChange}
        style={{
          width: '150px'
        }}
        wrapperStyle={{
          width: '150px'
        }}
        clearable={false}
        options={options}
      />
    )
  }
  return (
    <header id="header" className={`header ${headerClassName}`}>
      {showMobileMenu && (
        <div className="header-mobile-menu-container">
          {<MobileMenuLinks onMenuToggle={onMenuToggle} navigationData={navigationData} />}
        </div>
      )}
      <div className="container">
        <a className="header-logo-a" href={baseRootPath}>
          <img className="header-logo" src={logoImageName} alt="" />
        </a>
        <div className="links-container">
          <NavigationLinks navigationData={navigationData} />
        </div>
        <div className="mobile-menu">
          <img
            alt=""
            className={showMobileMenu ? 'mobile-menu-open-icon' : 'mobile-menu-icon'}
            onClick={onMenuToggle}
            src={showMobileMenu ? menuOpenIcon : menuIcon}
          />
        </div>
        {select}
      </div>
    </header>
  )
}

export default Header
