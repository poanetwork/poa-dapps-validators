import React from 'react'
import { IconFinalize } from '../IconFinalize'

export const ButtonFinalize = ({
  disabled = false,
  extraClassName = '',
  networkBranch,
  onClick,
  text = 'Finalize',
  ...props
}) => {
  return (
    <button
      className={`sw-ButtonFinalize ${extraClassName} sw-ButtonFinalize-${networkBranch}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
      {...props}
    >
      <span className="sw-ButtonFinalize_Text">{text}</span> <IconFinalize networkBranch={networkBranch} />
    </button>
  )
}
