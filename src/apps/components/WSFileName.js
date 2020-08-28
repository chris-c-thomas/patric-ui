
import React, {useState, useEffect} from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'


const usageError = (propName, value, label) => {
  return `TextInput component with label="${label}" must have prop: ${propName}.  ` +
    `Value was: ${value}`
}

export default function WSFileName(props) {
  const {
    label, value, adornment, type,
    onChange, style, noLabel, placeholder, prefix
  } = props;

  if (!label && !noLabel)
    throw usageError('label', label);

  const [val, setVal] = useState(value || '')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!value) return
    setVal(value)
  }, [value])

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
    <div>
      <TextField
        size="small"
        variant="outlined"
        type={type}
        value={val}
        label={label}
        onChange={handleChange}
        placeholder={placeholder}
        margin="dense"
        InputLabelProps={{
          shrink: true,
        }}
        {...(adornment ? inputProps : {})}
        {...(noLabel ? {style: {margin: 0}} : {})}
        {...(style ? {style} : {})}
      />
      {(prefix || value) &&
        <FormHelperText>
         <b>Output Name</b>: {prefix} {val}
        </FormHelperText>
      }
      {error &&
        <FormHelperText error={true}>
          File name already exists
        </FormHelperText>
      }
    </div>
  )
}

