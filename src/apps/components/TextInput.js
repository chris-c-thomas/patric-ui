
import React, {useState, useEffect} from 'react'

import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'


const usageError = (propName, value, label) => {
  return `TextInput component with label="${label}" must have prop: ${propName}.  ` +
    `Value was: ${value}`
}


export default function TextInput(props) {
  const {
    label, value, type,
    onChange, noLabel, placeholder, ...rest
  } = props


  if (!label && !noLabel)
    throw usageError('label', label)

  const [val, setVal] = useState(value)

  useEffect(() => {
    setVal(value)
  },[value])


  const handleChange = evt => {
    const val = evt.target.value
    setVal(val)
    if (onChange) onChange(val)
  }

  return (
    <div>
      <InputLabel shrink htmlFor="custom-text-field">
        {label}
      </InputLabel>
      <TextField
        id="custom-text-field"
        variant="outlined"
        type={type}
        value={val}
        onChange={handleChange}
        placeholder={placeholder}
        margin="dense"
        {...(noLabel ? {style: {margin: 0}} : {style: {marginTop: '20px'}} )}
        {...rest}
      />
    </div>
  )
}
