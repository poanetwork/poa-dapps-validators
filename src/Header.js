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

const Header = ({ netId, onChange, injectedWeb3, showMobileMenu, onMenuToggle, baseRootPath, navigationData }) => {
  const headerClassName = netId === '77' ? 'sokol' : ''
  const logoImageName = netId === '77' ? logoSokol : logoBase
  const menuIcon = netId === '77' ? menuIconSokol : menuIconBase
  const menuOpenIcon = netId === '77' ? menuOpenIconSokol : menuOpenIconBase

  let select

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
        options={[{ value: '77', label: 'Network: Sokol' }, { value: '99', label: 'Network: Core' }]}
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
