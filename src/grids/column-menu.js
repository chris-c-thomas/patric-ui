import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Paper, Checkbox, ClickAwayListener, FormControlLabel
} from '@material-ui/core';

import { grey } from '@material-ui/core/colors';

import SettingsIcon from '@material-ui/icons/Settings';
import Caret from '@material-ui/icons/ArrowDropDown';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    zIndex: 9999
  },
  paper: {
    position: 'absolute',
    top: 36,
    right: 0,
    minWidth: '300px',
    maxHeight: '400px',
    overflow: 'scroll',
    padding: theme.spacing(1)
  },
  fake: {
    backgroundColor: grey[200],
    height: theme.spacing(1),
    margin: theme.spacing(2),
    // Selects every two elements among any group of siblings.
    '&:nth-child(2n)': {
      marginRight: theme.spacing(3),
    },
  },
}));

export default function ColumnMenu(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState(props.columns)

  const initSelected = columns.reduce((obj, col) => {
    obj[col.data] = !col.hide || false;
    return obj;
  }, {})
  const [selected, setSelected] = useState(initSelected);


  const handleClick = () => {
    setOpen(prev => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleChange = (name, i) => event => {
    let checked = event.target.checked

    setSelected({...selected, [name]: checked});

    // don't delay checkbox
    setTimeout(() => {
      props.onColumnChange(i, checked);
    });
  };

  const fake = <div className={classes.fake} />;

  const controls = columns.map((col, i) => {
    return (
      <div key={i}>
        <FormControlLabel
          key={i}
          control={
            <Checkbox
              checked={selected[col.data]}
              onChange={handleChange(col.data, i)}
              color="primary"
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              disableRipple
            />
          }
          label={col.label || col.data}
        />
      </div>)
  })

  return (
    <div className={classes.root}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
        <Button onClick={handleClick} size="small" variant="outlined" disableRipple>
          <SettingsIcon /> <Caret />
        </Button>
          {open ? (
            <Paper className={classes.paper}>
              {controls}
            </Paper>
          ) : null}
        </div>
      </ClickAwayListener>
    </div>
  );
}