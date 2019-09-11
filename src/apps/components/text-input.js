
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';


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

  const {label, value} = props;

  if (!label) throw ('TextInput component must have prop: label');
  if (typeof value == 'undefined')
    throw (`TextInput component must have prop: value.  Was: ${value}`);


  return (
    <FormControl variant="outlined" margin="dense" notched="true" className="text-input">
      <TextField
        variant="outlined"
        value={value || ''}
        id={label}
        label={label}
        margin="dense"
        InputProps={{
          startAdornment: <InputAdornment position="start">{props.adornment}</InputAdornment>,
        }}
      />
    </FormControl>
  )
}

