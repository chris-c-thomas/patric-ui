
import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextInputCustom from './TextInputCustom'
// import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0),
  },
}))


export default function Selector(props) {
  const classes = useStyles()
  const {options, label, value, width} = props

  if (!options) throw ('Selector component must have prop: options')
  if (!label) throw ('Selector component must have prop: label')
  if (typeof value == 'undefined')
    throw (`Selector component must have prop: value.  Was: ${value}`)

  const [val, setVal] = useState(value)

  useEffect(() => {
    setVal(value)
  }, [value])

  const handleChange = (evt) => {
    const val = evt.target.value
    setVal(val)
    if (props.onChange) props.onChange(val)
  }


  return (
    <FormControl className={classes.margin}>
      <InputLabel id="custom-select">
        {label}
      </InputLabel>
      <Select
        labelId="custom-select"
        size="small"
        value={val}
        style={{minWidth: width}}
        onChange={handleChange}
        /*
        label={label}
        variant="outlined"
        margin="dense"
        InputLabelProps={{shrink: true}}
        */
        input={<TextInputCustom  name={label} id={label} size="small"/>}
      >
        {
          options.map((obj, i) => <MenuItem key={i} value={obj.value}>{obj.label}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}

