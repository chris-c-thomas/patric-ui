import React, { useState, useEffect } from 'react'

import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import highlightText from '../../../utils/text'

import ObjectSelectorDialog from './ObjectSelectorDialog'

import * as WS from '../../../api/ws-api'
import {getUser} from '../../../api/auth'



const usageError = (propName, value) =>
  `ObjectSelector component must have prop: ${propName}.  Value was: ${value}`


const formatOptionLabel = (option, query: string) => {
  const label = option.path,
    i = label.lastIndexOf('/') + 1,
    path = label.slice(0, i),
    name = label.slice(i)

  return (
    <div>
      <small>
        {path}
      </small><br/>
      <b>{query ?  highlightText(name, query) : name}</b>
    </div>
  )
}


const getName = (path: string) => path.slice(path.lastIndexOf('/')+1)


type Props = {
  showHidden?: boolean       // show names with dots
  onlyUserVisible?: boolean  // no dots in any parents
  dialogTitle: string | JSX.Element
  value: string // workspace path in this case
  label?: string
  type?: string
  placeholder?: string
  onChange: (path: string) => void
}

export default function ObjectSelector(props: Props) {
  const {
    type,
    showHidden,
    onlyUserVisible,
    dialogTitle,
    label,
    value,
    placeholder,
    onChange
  } = props

  if (!type)
    throw usageError('type', type)
  if (!dialogTitle)
    throw usageError('dialogTitle', dialogTitle)
  if (typeof value == 'undefined')
    throw usageError('value', value)

  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const [path, setPath] = useState(value)


  // allow the value to be set from outside this component
  useEffect(() => {
    setPath(value)
  }, [value])

  useEffect(() => {
    let active = true;

    (async () => {
      let path = `/${getUser(true)}/home`

      let data
      try {
        setLoading(true)
        data = await WS.list({path, type, recursive: true, showHidden, onlyUserVisible})
      } catch (err) {
        setError(err)
      }

      if (!active) return

      setOptions(data)
      setLoading(false)
    })()


    return () => {
      active = false
    }
  }, [type, showHidden])


  const handleQuery = (evt) => {
    setQuery(evt.target.value)

    // on query remove selection
    onChange(null)
  }

  const handleInputChange = (evt, val, reason) => {
    if (reason != 'reset') return
    onChange(null)
  }

  const onDialogSelect = (path) => {
    onChange(path)
  }


  const handleOnChange = (evt, obj) => {
    onChange(obj ? obj.path : null)
    setQuery('')
  }


  return (
    <>
      <div>
        <InputLabel shrink htmlFor={label}>
          {label || ' '}
        </InputLabel>

        <Autocomplete
          autoComplete
          style={{ width: 350 }}
          getOptionLabel={({path}) => getName(path)}
          options={options}
          getOptionSelected={option => option.path == path}
          inputValue={path ? getName(path) : query}
          onInputChange={handleInputChange}
          value={path ? {path} : null}
          onChange={handleOnChange}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={handleQuery}
              size="small"
              variant="outlined"
              /*
              label={label || ''}
              InputLabelProps={{shrink: true}}
              */
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
              placeholder={placeholder || null}
            />
          )}
          renderOption={(option) => formatOptionLabel(option, query)}
        />

        {error &&
          <FormHelperText error>
            There was a problem fetching workspace data.
            Please try to refresh/connect your browser or contact us if this issue persists.
          </FormHelperText>
        }
      </div>

      <ObjectSelectorDialog
        title={dialogTitle}
        fileType={type}
        onSelect={onDialogSelect}
      />
    </>
  )
}




