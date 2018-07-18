import React from 'react'
import { NavLink } from 'react-router-dom'

const MobileMenuLinks = ({ onMenuToggle, navigationData }) => {
  return (
    <div className="links-container-mobile" onClick={onMenuToggle}>
      {navigationData.map((item, index) => (
        <NavLink activeClassName="active" className="link" exact to={item.url} key={index}>
          <i className={`link-icon ${item.icon}`} />
          <span className="link-text">{item.title}</span>
        </NavLink>
      ))}
    </div>
  )
}

export default MobileMenuLinks
