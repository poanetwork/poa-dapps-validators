import PlacesAutocomplete from 'react-places-autocomplete'
import React from 'react'
import { FormFieldTitle } from '../FormFieldTitle'

export const FormAutocomplete = ({ extraClassName = '', id, onSelect, title, autocompleteItem, inputProps }) => {
  return (
    <div className={`frm-FormAutocomplete ${extraClassName}`}>
      <FormFieldTitle htmlFor={id} text={title} />
      <PlacesAutocomplete autocompleteItem={autocompleteItem} inputProps={inputProps} onSelect={onSelect} />
    </div>
  )
}
