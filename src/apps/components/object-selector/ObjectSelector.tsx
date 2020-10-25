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

import {WSObject} from '../../../api/workspace.d'


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
        {query ?  highlightText(path, query) : path}
      </small><br/>
      <b>{query ?  highlightText(name, query) : name}</b>
    </div>
  )
}


type Props = {
  includeHidden?: boolean
  dialogTitle: string | JSX.Element
  value: string // workspace path in this case
  label?: string
  type?: string
  placeholder?: string
  onChange: (object: WSObject) => void
}

export default function ObjectSelector(props: Props) {
  const {
    type,
    includeHidden,
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
    (async () => {
      let path = `/${getUser(true)}/home`

      let data
      try {
        setLoading(true)
        data = await WS.list({path, type, recursive: true, includeHidden})
      } catch (err) {
        setError(err)
      }

      setOptions(data)
      setLoading(false)
    })()
  }, [type, includeHidden])


  const onDialogSelect = (path) => {
    onChange(path)
  }

  const handleOnChange = (evt, obj) => {
    onChange(obj ? obj.path : null)
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
          getOptionLabel={({path}) => path.slice(path.lastIndexOf('/')+1)}
          options={options}
          value={path && {path}}
          getOptionSelected={option => option.path == path}
          onChange={handleOnChange}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(evt) => setQuery(evt.target.value)}
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




