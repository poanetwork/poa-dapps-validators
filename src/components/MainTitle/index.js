import React from 'react'

export const MainTitle = ({ extraClassName = '', text = '', extraText = undefined }) => {
  return (
    <div className={`sw-MainTitle ${extraClassName}`}>
      <div className="sw-MainTitle_Content">
        <h1 className="sw-MainTitle_Text">{text}</h1>
        {extraText ? <h2 className="sw-MainTitle_ExtraText" dangerouslySetInnerHTML={{ __html: extraText }} /> : null}
      </div>
    </div>
  )
}
