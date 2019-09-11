
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { TextField, FormControl } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
}));


const usageError = (propName, value, label) => {
  return `TextInput component with label="${label}" must have prop: ${propName}.  ` +
    `Value was: ${value}`
}

export default function TextInput(props) {
  const {label, value, adornment, type} = props;

  if (!label) throw usageError('label', label);
  if (typeof value == 'undefined') throw usageError('value', value, label);

  let inputProps = {
    InputProps: {
      startAdornment: <InputAdornment position="start">{adornment}</InputAdornment>,
    }
  }

  return (
    <FormControl variant="outlined" margin="dense" notched="true" className="text-input">
      <TextField
        variant="outlined"
        type={type}
        value={value || ''}
        id={label}
        label={label}
        margin="dense"
        {...(adornment ? inputProps : {})}
      />
    </FormControl>
  )
}

