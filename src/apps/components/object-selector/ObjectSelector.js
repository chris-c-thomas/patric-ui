import React, { useState, useEffect } from 'react'
// import styled from 'styled-components'

import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

import AsyncSelect from 'react-select/async'
import highlightText from '../../../utils/text'

import ObjectSelectorDialog from './ObjectSelectorDialog'

import { pathToOptionObj } from '../../../utils/paths'
import * as WS from '../../../api/ws-api'
import {getUser} from '../../../api/auth'

const inputStyles = {
  menu: styles => ({
    ...styles,
    zIndex: 9999
  }),
  input: styles => ({
    ...styles,
    width: '250px'
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
  } = props

  if (!type)
    throw usageError('type', type)
  if (!dialogTitle)
    throw usageError('dialogTitle', dialogTitle)
  if (typeof value == 'undefined')
    throw usageError('value', value)

  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [selectedPath, setSelectedPath] = useState(null)
  const [query, setQuery] = useState(null)

  // here allow the value to be set from outside this component
  useEffect(() => {
    _setPath(props.value)
  }, [props.value])

  const onDialogSelect = (path) => {
    _setPath(path)
  }

  const filterItems = () => {
    return items.filter(i =>
      i.value.toLowerCase().includes(query.toLowerCase())
    )
  }

  const loadOptions = (inputValue, callback) => {
    if (items) {
      callback(filterItems())
      return
    }

    let path = `/${getUser(true)}/home`
    WS.list({path, type, recursive: true, showHidden: false})
      .then(data => {
        const items = data.map(obj => pathToOptionObj(obj.path))

        setItems(items)
        callback(items)
      }).catch(err => {
        setError(err)
        callback([])
      })
  }

  const formatOptionLabel = (opt) => {
    let label = opt.label,
      i = label.lastIndexOf('/') + 1,
      path = label.slice(0, i),
      name = label.slice(i)

    return (
      <div>
        <small>
          {query ?  highlightText(path, query) : path}
        </small><br/>
        <b>{query ?  highlightText(name, query) : name}</b>
      </div>
    )
  }

  const _setPath = (path) => {
    const obj = pathToOptionObj(path)
    setSelectedPath(obj)
    if (onChange) onChange(path)
  }

  return (
    <>
      <div>
        <InputLabel shrink htmlFor={label}>
          {label || ' '}
        </InputLabel>

        <AsyncSelect
          id={label}
          cacheOptions
          defaultOptions
          placeholder={placeholder}
          loadOptions={loadOptions}
          styles={inputStyles}
          formatOptionLabel={formatOptionLabel}
          noOptionsMessage={() => 'No results'}
          onInputChange={val => setQuery(val)}
          onChange={obj => _setPath(obj.value)}
          value={selectedPath}
        />
        {
          error &&
          <FormHelperText error={true}>
            There was a problem fetching workspace data.
            Please try to refresh/connect your browser or contact us.
          </FormHelperText>
        }
      </div>

      <ObjectSelectorDialog
        title={dialogTitle}
        type={type}
        onSelect={onDialogSelect}
      />
    </>
  )
}




