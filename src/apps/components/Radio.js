import React, {useState} from 'react'
import styled from 'styled-components'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'


export default function RadioSelector(props) {
  const {options, legend, value} = props

  if (!options)
    throw ('Radio component must have prop: options')
  if (typeof value == 'undefined')
    throw (`Radio component must have prop: value.  Was: ${value}`)


  const [val, setVal] = useState(value || props.default)

  const handleChange = (evt) => {
    const val = evt.target.value
    setVal(val)

    if (props.onChange)
      props.onChange(val)
  }

  return (
    <FormControl component="fieldset">
      {legend &&
        <FormLabel component="legend">{legend}</FormLabel>
      }
      <RadioGroup row={props.row} value={value} onChange={handleChange}>
        {options.map(({value, label}) =>
          <Label
            key={value}
            label={label}
            control={
              <Radio size="small" color="primary" value={value}/>
            }
          />
        )}
      </RadioGroup>
    </FormControl>
  )
}

const Label = styled(FormControlLabel)`
  .MuiTypography-body1 {
    font-size: 1em;
  }

`