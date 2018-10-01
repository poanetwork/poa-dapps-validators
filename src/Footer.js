import React from 'react'
import moment from 'moment'
import Socials from './Socials'

const Footer = ({ netId }) => {
  const isTestnet = netId === '77' || netId === '79'
  const footerClassName = isTestnet ? 'sokol' : ''

  return (
    <footer className={`footer ${footerClassName}`}>
      <div className="container">
        <a href="/">
          <i className="footer-logo" />
        </a>
        <p className="footer-rights">{moment().format('YYYY')} POA. All rights reserved.</p>
        <Socials />
      </div>
    </footer>
  )
}

export default Footer
