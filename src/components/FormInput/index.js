import React from 'react'
import { FormFieldTitle } from '../FormFieldTitle'

export const FormInput = ({
  disabled = false,
  extraClassName = '',
  id,
  min,
  onChange,
  placeholder,
  title,
  type = 'text',
  value
}) => {
  return (
    <div className={`frm-FormInput ${extraClassName}`}>
      <FormFieldTitle htmlFor={id} text={title} />
      <input
        className="frm-FormInput_Field"
        disabled={disabled}
        id={id}
        min={min}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  )
}
