
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Select } from '@material-ui/core';
import { FormControl, InputLabel, OutlinedInput, MenuItem } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3, 0)
  },
  label: {
    // Fixme(nc): likely a bug with material-ui
    background: '#fff',
    padding: '0 3px'
  }
}));


export default function Selector(props) {
  const styles = useStyles()

  const {options, label, name, width} = props;

  if (!options) throw ('Selector component must have prop: options');
  if (!label) throw ('Selector component must have prop: label');
  if (!name) throw ('Selector component must have prop: name');

  const [value, setValue] = useState(props.default);

  return (
    <FormControl variant="outlined" margin="dense" notched="true" className={styles.formControl}>
      <InputLabel htmlFor={name} className={styles.label}>
        {label}
      </InputLabel>
      <Select
        value={value}
        style={{width}}
        onChange={evt => setValue(evt.target.value)}
        input={<OutlinedInput name={name} id={name} />}
      >
        {
          options.map((obj, i) => <MenuItem key={i} value={obj.value}>{obj.label}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}

