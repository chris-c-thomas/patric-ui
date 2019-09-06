import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import { InputLabel } from '@material-ui/core';

import AsyncSelect from 'react-select/async';
import highlightText from '../../../utils/text'
import ObjectSelectorDialog from './object-selector-dialog';

import * as WS from '../../../api/workspace-api';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 290
  }
}));

const inputStyles = {
  menu: styles => ({
    ...styles,
    zIndex: 9999
  }),
  input: styles => ({
    ...styles,
    minWidth: '450px'
  })
}

export default function ObjectSelector(props) {
  const styles = useStyles();

  const {type, dialogTitle, placeholder, label, value} = props;

  const [items, setItems] = useState(null);
  const [selectedPath, setSelectedPath] = useState();
  const [query, setQuery] = useState(null);

  // here allow the value to be set from outside this component
  useEffect(() => {
    if (!value) return;

    _setPath(value)
  }, [value])

  function onDialogSelect(path) {
    _setPath(path)
  }

  const filterItems = () => {
    return items.filter(i =>
      i.value.toLowerCase().includes(query.toLowerCase())
    );
  };

  const loadOptions = (inputValue, callback) => {
    if (items) {
      callback(filterItems())
      return;
    }

    let path = '/nconrad@patricbrc.org/home';
    WS.list({path, type, recursive: true, showHidden: false})
      .then(data => {
        const items = data.map((obj, i) => {
          const parts = obj.path.split('/');

          return {
            label: '/' + parts.slice(2).join('/'),
            value: obj.path
          };
        });
        setItems(items)
        callback(items)
      })
  };

  const formatOptionLabel = (opt) => {
    let label = opt.label,
      i = label.lastIndexOf('/') + 1,
      path = label.slice(0, i)
      name = label.slice(i);

    return <div>
      <small>
        {query ?  highlightText(path, query) : path}
      </small><br/>
      <b>{query ?  highlightText(name, query) : name}</b>
    </div>
  }

  const _setPath = (path) => {
    const parts = path.split('/');

    setSelectedPath({
      label: '/' + parts.slice(2).join('/'),
      value: path
    });
  }

  return (
    <div className={styles.root}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <InputLabel shrink htmlFor={label}>
            {label}
          </InputLabel>
          <AsyncSelect
            id={label}
            cacheOptions
            defaultOptions
            placeholder={placeholder}
            loadOptions={loadOptions}
            styles={inputStyles}
            formatOptionLabel={formatOptionLabel}
            noOptionsMessage={() => "No results"}
            onInputChange={val => setQuery(val)}
            onChange={obj => setSelectedPath(obj)}
            value={selectedPath}
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
    </div>
  );
}
