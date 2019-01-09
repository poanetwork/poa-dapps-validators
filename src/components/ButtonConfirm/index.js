import React from 'react'
import { IconConfirm } from '../IconConfirm'

export const ButtonConfirm = ({ extraClassName = '', networkBranch, onClick, disabled = false, text = 'Confirm' }) => {
  return (
    <button
      className={`sw-ButtonConfirm ${extraClassName} sw-ButtonConfirm-${networkBranch}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="sw-ButtonConfirm_Text">{text}</span> <IconConfirm networkBranch={networkBranch} />
    </button>
  )
}
