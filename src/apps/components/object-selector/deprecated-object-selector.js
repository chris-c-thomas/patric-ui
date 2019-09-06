import React, { useEffect, useState } from 'react';
import PT from 'prop-types';
import Select from 'react-select';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import {FormControl, Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

import ObjectSelectorDialog from './object-selector-dialog';

import * as WS from '../../../api/workspace-api';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 290
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 15,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  formControl: {
    margin: theme.spacing(1),
    ' > *': {
      display: 'inline-block'
    }

  },
}));


function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

NoOptionsMessage.PT = {
  children: PT.node,
  innerProps: PT.object.isRequired,
  selectProps: PT.object.isRequired,
};

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.PT = {
  inputRef: PT.oneOfType([
    PT.func,
    PT.shape({
      current: PT.any.isRequired,
    }),
  ]),
};

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

Control.PT = {
  children: PT.node,

  innerProps: PT.shape({
    onMouseDown: PT.func.isRequired,
  }).isRequired,
  innerRef: PT.oneOfType([
    PT.oneOf([null]),
    PT.func,
    PT.shape({
      current: PT.any.isRequired,
    }),
  ]).isRequired,
  selectProps: PT.object.isRequired,
};

function Option(props) {
  return (
    <MenuItem
      title={props.children}
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

Option.PT = {
  children: PT.node,
  innerProps: PT.shape({
    id: PT.string.isRequired,
    onClick: PT.func.isRequired,
    onMouseMove: PT.func.isRequired,
    onMouseOver: PT.func.isRequired,
    tabIndex: PT.number.isRequired,
  }).isRequired,
  isFocused: PT.bool.isRequired,
  isSelected: PT.bool.isRequired,
};

function Placeholder(props) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
}

Placeholder.PT = {
  children: PT.node,
  innerProps: PT.object,
  selectProps: PT.object.isRequired,
};

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

SingleValue.PT = {
  children: PT.node,
  innerProps: PT.any.isRequired,
  selectProps: PT.object.isRequired,
};

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

ValueContainer.PT = {
  children: PT.node,
  selectProps: PT.object.isRequired,
};

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

Menu.PT = {
  children: PT.element.isRequired,
  innerProps: PT.object.isRequired,
  selectProps: PT.object.isRequired,
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

export default function ObjectSelector(props) {
  const classes = useStyles();
  const theme = useTheme();

  const {type, dialogTitle, placeholder, label} = props;

  const [items, setItems] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

  useEffect(() => {
    let path = '/nconrad@patricbrc.org/home';

    WS.list({path, type, recursive: true, showHidden: false})
      .then(data => {
        const items = data.map((obj, i) => {
          return {
            label: '/' + obj.path.split('/').slice(2).join('/'),
            value: obj.value
          };
        });
        setItems(items)
      })
  }, [])


  function setPath(path) {
    setSelectedPath(path);
  }

  function onDialogSelect(path) {
    setPath(path)
  }

  const selectStyles = {
    input: base => ({
      width: '500px',
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  const folderStyles = {
  }

  return (
    <div className={classes.root}>
      <NoSsr>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <Select
              classes={classes}
              styles={selectStyles}
              inputId="react-select-single"
              TextFieldProps={{
                label: label,
                variant: "outlined",
                InputLabelProps: {
                  htmlFor: 'react-select-single',
                  shrink: true,
                },
              }}
              placeholder={placeholder}
              options={items}
              components={components}
              value={selectedPath}
              onChange={setPath}
            />
          </Grid>

          <Grid item>
            <ObjectSelectorDialog
              title={dialogTitle}
              type={type}
              onSelect={onDialogSelect}
            />
          </Grid>
        </Grid>

      </NoSsr>
    </div>
  );
}
