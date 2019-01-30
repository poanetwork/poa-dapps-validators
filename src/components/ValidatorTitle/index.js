import React from 'react'
import { ValidatorTitleIcon } from '../ValidatorTitleIcon'

export const ValidatorTitle = ({ extraClassName = '', text = '', type, networkBranch = '' }) => {
  return (
    <h3 className={`vl-ValidatorTitle ${extraClassName}`}>
      <ValidatorTitleIcon networkBranch={networkBranch} type={type} />
      <span className={`vl-ValidatorTitle_Text`}>{text}</span>
    </h3>
  )
}
