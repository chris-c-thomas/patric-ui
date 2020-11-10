
import React, {useState, useEffect} from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'

import InputBase from '@material-ui/core/InputBase'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
// import TextField from '@material-ui/core/TextField'


const CustomInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(2.2),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '250px',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase)

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0),
  },
}))


const usageError = (propName, value, label) => {
  return `WSFileName component with label="${label}" must have prop: ${propName}.  ` +
    `Value was: ${value}`
}

export default function WSFileName(props) {
  const classes = useStyles()
  const {
    label, value, adornment, type,
    onChange, noLabel, placeholder, prefix,
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
    <FormControl className={classes.margin}>
      <InputLabel shrink htmlFor="custom-input">{label}</InputLabel>
      <CustomInput
        id="custom-input"
        type={type}
        value={val}
        onChange={handleChange}
        placeholder={placeholder}
        /*
        label={label}
        InputLabelProps={{shrink: true}}
        variant="outlined"
        margin="dense"
        */
        {...(adornment ? inputProps : {})}
        {...(noLabel ? {style: {margin: 0}} : {})}
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
    </FormControl>
  )
}

