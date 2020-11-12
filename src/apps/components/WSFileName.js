
import React, {useState, useEffect} from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'


const usageError = (propName, value, label) => {
  return `WSFileName component with label="${label}" must have prop: ${propName}.  ` +
    `Value was: ${value}`
}


export default function WSFileName(props) {
  const {
    label, value, adornment, type,
    onChange, noLabel, prefix,
    showHelperText = false, ...rest
  } = props

  if (!label && !noLabel)
    throw usageError('label', label)

  const [val, setVal] = useState(value || '')
  const [error] = useState(false)

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
      <InputLabel shrink htmlFor="workspace-file-name">
        {label}
      </InputLabel>
      <TextField
        id="workspace-file-name"
        type={type}
        value={val}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        {...(adornment ? inputProps : {})}
        {...rest}
      />
      {(prefix || value) && showHelperText &&
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

