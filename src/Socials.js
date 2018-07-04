import React from 'react';

let Socials = () => {

  const socialItems = [
    {
    'icon': 'socials-i_twitter',
    'title': 'Twitter',
    'url': 'https://twitter.com/poanetwork'
    },
    {
    'icon': 'socials-i_poa',
    'title': 'POA Network',
    'url': 'https://poa.network'
    },
    {
    'icon': 'socials-i_telegram',
    'title': 'Telegram',
    'url': 'https://t.me/oraclesnetwork'
    },
    {
      'icon': 'socials-i_github',
      'title': 'GitHub',
      'url': 'https://github.com/poanetwork/'
    }];

  return (
    <div className="socials">
      {socialItems.map((item) =>
        <a href={ item.url } className={`socials-i ${ item.icon }`}>{ item.title }</a>
      )}
    </div>
    );
};

export default Socials;
