
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';


import { TextField, FormControl } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  label: {
    // Fixme(nc): likely a bug with material-ui
    background: '#fff',
    padding: '0 3px'
  }
}));


export default function TextInput(props) {
  const styles = useStyles()

  const {label, value, adornment} = props;

  if (!label) throw ('TextInput component must have prop: label');
  if (typeof value == 'undefined')
    throw (`TextInput component must have prop: value.  Was: ${value}`);


  let inputProps = {
    InputProps: {
      startAdornment: <InputAdornment position="start">{adornment}</InputAdornment>,
    }
  }

  return (
    <FormControl variant="outlined" margin="dense" notched="true" className="text-input">
      <TextField
        variant="outlined"
        value={value || ''}
        id={label}
        label={label}
        margin="dense"
        {...(adornment ? inputProps : {})}
      />
    </FormControl>
  )
}

