import React from 'react'
import { FormFieldTitle } from '../FormFieldTitle'

export const FormRadioButton = ({
  checked = false,
  disabled = false,
  extraClassName = '',
  id,
  name,
  networkBranch,
  onChange,
  text,
  title,
  value
}) => {
  return (
    <div className={`frm-FormRadioButton ${extraClassName}`}>
      <FormFieldTitle htmlFor={id} text={title} />
      <div className="frm-FormRadioButton_Button">
        <input
          checked={checked}
          className="frm-FormRadioButton_Radio"
          disabled={disabled}
          id={id}
          name={name}
          onChange={onChange}
          type="radio"
          value={value}
        />
        <label className={`frm-FormRadioButton_Label frm-FormRadioButton_Label-${networkBranch}`} htmlFor={id}>
          {text}
        </label>
      </div>
    </div>
  )
}
