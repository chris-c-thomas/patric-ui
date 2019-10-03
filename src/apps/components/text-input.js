
import React, {useState} from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import { TextField, FormControl } from '@material-ui/core';


const usageError = (propName, value, label) => {
  return `TextInput component with label="${label}" must have prop: ${propName}.  ` +
    `Value was: ${value}`
}

export default function TextInput(props) {
  const {label, value, adornment, type, onChange} = props;

  if (!label) throw usageError('label', label);

  const [val, setVal] = useState(value || '')

  let inputProps = {
    InputProps: {
      startAdornment: <InputAdornment position="start">{adornment}</InputAdornment>,
    }
  }

  const handleChange = evt => {
    const val = evt.target.value
    setVal(val)
    if (onChange) onChange(val)
  }

  return (
    <FormControl variant="outlined" margin="dense" notched="true" className="text-input">
      <TextField
        variant="outlined"
        type={type}
        value={val}
        onChange={handleChange}
        id={label}
        label={label}
        margin="dense"
        {...(adornment ? inputProps : {})}
      />
    </FormControl>
  )
}

