
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Select } from '@material-ui/core';
import { FormControl, InputLabel, OutlinedInput, MenuItem } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(5, 0),
    minWidth: 120,
    display: 'block'
  },
  label: {
    // possibly a bug with material-ui
    background: '#fff',
    padding: '0 3px'
  }
}));


export default function Selector(props) {
  const styles = useStyles()

  const {options, label, id} = props;

  if (!options) throw ('Selector component must have prop: options');
  if (!label) throw ('Selector component must have prop: label');
  if (!id) throw ('Selector component must have prop: id');

  const [value, setValue] = useState(props.default);

  return (
    <FormControl variant="outlined" margin="dense" notched="true" className={styles.formControl}>
      <InputLabel htmlFor={id} className={styles.label}>
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={(evt) => setValue(evt.target.value)}
        input={<OutlinedInput name="domain" id={id} />}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {
          options.map((obj, i) => <MenuItem key={i} value={obj.value}>{obj.label}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}

