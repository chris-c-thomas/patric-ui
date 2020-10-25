
import React, {useState} from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'


const usageError = (propName, value, label) => {
  return `TextInput component with label="${label}" must have prop: ${propName}.  ` +
    `Value was: ${value}`
}


export default function TextInput(props) {
  const {
    label, value, type,
    onChange, style, noLabel, placeholder, ...rest
  } = props

  if (!label && !noLabel)
    throw usageError('label', label)

  const [val, setVal] = useState(value)

  const handleChange = evt => {
    const val = evt.target.value
    setVal(val)
    if (onChange) onChange(val)
  }

  return (
    <FormControl>
      {/*
      <InputLabel shrink>
        {label}
      </InputLabel>
      */}
      <TextField
        label={label}
        size="small"
        variant="outlined"
        type={type}
        value={val}
        onChange={handleChange}
        placeholder={placeholder}
        margin="dense"
        InputLabelProps={{shrink: true}}
        {...(noLabel ? {style: {margin: 0}} : {})}
        {...(style ? {style} : {})}
        {...rest}
      />
    </FormControl>
  )
}

