
import React, {useState} from 'react'
import styled from 'styled-components'

import { Select } from '@material-ui/core'
import { FormControl, InputLabel, OutlinedInput, MenuItem } from '@material-ui/core'


export default function Selector(props) {
  const {options, label, value, width} = props

  if (!options) throw ('Selector component must have prop: options')
  if (!label) throw ('Selector component must have prop: label')
  if (typeof value == 'undefined')
    throw (`Selector component must have prop: value.  Was: ${value}`)

  const [val, setVal] = useState(value || props.default)

  const handleChange = (evt) => {
    const val = evt.target.value
    setVal(val)
    if (props.onChange) props.onChange(val)
  }

  return (
    <FormControl variant="outlined" margin="dense" notched="true" className="selector">
      <Label htmlFor={label}>
        {label}
      </Label>
      <Select
        value={val}
        style={{minWidth: width}}
        onChange={handleChange}
        input={<OutlinedInput name={label} id={label} />}
      >
        {
          options.map((obj, i) => <MenuItem key={i} value={obj.value}>{obj.label}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}

const Label = styled(InputLabel)`
  background: #fff;
  padding: 0 3px !important;
`

