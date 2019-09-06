
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';


import { TextField, FormControl } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(5, 0),
    minWidth: 120,
    display: 'block'
  },
  label: {
    // Fixme(nc): likely a bug with material-ui
    background: '#fff',
    padding: '0 3px'
  }
}));


export default function TextInput(props) {
  const styles = useStyles()

  const {label, name} = props;

  if (!label) throw ('TextInput component must have prop: label');
  if (!name) throw ('TextInput component must have prop: name');

  return (
    <FormControl variant="outlined" margin="dense" notched="true" className={styles.formControl}>
      <TextField
        variant="outlined"
        id={name}
        label={label}
        className={clsx(styles.textField, styles.dense)}
        margin="dense"
        InputProps={{
          startAdornment: <InputAdornment position="start">{props.adornment}</InputAdornment>,
        }}
      />
    </FormControl>
  )
}

