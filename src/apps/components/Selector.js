
import React, {useEffect, useState} from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'




export default function Selector(props) {
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
    <div>
      <InputLabel shrink id="custom-select">
        {label}
      </InputLabel>
      <Select
        labelId="custom-select"
        value={val}
        style={{minWidth: width}}
        onChange={handleChange}
        variant="outlined"
        margin="dense"
      >
        {
          options.map((obj, i) => <MenuItem key={i} value={obj.value}>{obj.label}</MenuItem>)
        }
      </Select>
    </div>
  )
}

