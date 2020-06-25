import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import { InputLabel } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';

import AsyncSelect from 'react-select/async';
import highlightText from '../../../utils/text'
import ObjectSelectorDialog from './object-selector-dialog';

import { pathToOptionObj } from '../../../utils/paths';
import * as WS from '../../../api/workspace';


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

const usageError = (propName, value) => {
  return `ObjectSelector component must have prop: ${propName}.  Value was: ${value}`
}

export default function ObjectSelector(props) {
  const {
    type,
    dialogTitle,
    placeholder,
    label,
    value,
    onChange
  } = props;

  if (!type) throw usageError('type', type);
  if (!dialogTitle) throw usageError('dialogTitle', dialogTitle);
  // if (!label) throw usageError('label', label);
  if (typeof value == 'undefined')
    throw usageError('value', value);

  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
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
        const items = data.map(obj => pathToOptionObj(obj.path));

        setItems(items)
        callback(items)
      }).catch(err => {
        setError(err);
        callback([]);
      });
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
    const obj = pathToOptionObj(path);
    setSelectedPath(obj);
    if (onChange) onChange(path);
  }

  return (
    <span>
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
        onChange={obj => _setPath(obj.value)}
        value={selectedPath}
        className="object-selector"
      />
      {
        error &&
        <FormHelperText error={true}>
          There was a problem fetching workspace data.
          Please try to refresh/connect your browser or contact us.
        </FormHelperText>
      }

      <ObjectSelectorDialog
        title={dialogTitle}
        type={type}
        onSelect={onDialogSelect}
      />
    </span>
  );
}
