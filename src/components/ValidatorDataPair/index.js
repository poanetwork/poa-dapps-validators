import React from 'react'

export const ValidatorDataPair = ({ extraClassName = '', data }) => {
  return (
    <div className={`vl-ValidatorDataPair ${extraClassName}`}>
      {data.map((item, index) => {
        return (
          <p key={index} className="vl-ValidatorDataPair_Info">
            {item}
          </p>
        )
      })}
    </div>
  )
}
