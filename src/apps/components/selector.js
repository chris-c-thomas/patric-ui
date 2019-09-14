
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Select } from '@material-ui/core';
import { FormControl, InputLabel, OutlinedInput, MenuItem } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  label: {
    // Fixme(nc): likely a bug with material-ui
    background: '#fff',
    padding: '0 3px'
  }
}));


export default function Selector(props) {
  const styles = useStyles()

  const {options, label, value, width} = props;

  if (!options) throw ('Selector component must have prop: options');
  if (!label) throw ('Selector component must have prop: label');
  if (typeof value == 'undefined')
    throw (`Selector component must have prop: value.  Was: ${value}`);

  const [val, setVal] = useState(value || props.default);

  return (
    <FormControl variant="outlined" margin="dense" notched="true" className="selector">
      <InputLabel htmlFor={label} className={styles.label}>
        {label}
      </InputLabel>
      <Select
        value={val}
        style={{minWidth: width}}
        onChange={evt => setVal(evt.target.value)}
        input={<OutlinedInput name={label} id={label} />}
      >
        {
          options.map((obj, i) => <MenuItem key={i} value={obj.value}>{obj.label}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}

