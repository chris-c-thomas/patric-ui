import React, { useState, useEffect } from 'react'

import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import highlightText from '../../utils/text'

import { queryTaxonID } from '../../api/data-api'



const formatOption = (opt, query) => (
  <div>
    {highlightText(opt.taxon_id, query || '')}{' '}
    {opt.taxon_name && `[${opt.taxon_name}]`}
  </div>
)


type Props = {
  value: string;
  placeholder?: string;
  onChange: (object: {taxon_id: string}) => void;
}


export default function ObjectSelector(props: Props) {
  const {
    value,
    placeholder,
    onChange,
  } = props


  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)

  // selected state
  const [val, setVal] = useState(value ? {taxon_id: value} : null)


  // allow the value to be set from outside this component
  useEffect(() => {
    setVal(value ? {taxon_id: value} : null)
  }, [value])


  // request on query
  useEffect(() => {
    (async () => {
      if (!query) {
        return
      }

      let data
      try {
        setLoading(true)
        data = await queryTaxonID({query})
      } catch (err) {
        setError(err)
      }

      console.log('data', data)
      setOptions(data)
      setLoading(false)
    })()
  }, [query])


  const handleOnChange = (evt, value) => {
    console.log('changing id', value)
    onChange(value ? value : null)
  }


  return (
    <div>
      <InputLabel shrink htmlFor="taxon-id">
        Taxonomy ID
      </InputLabel>

      <Autocomplete
        autoComplete
        style={{ width: 150 }}
        getOptionLabel={option =>  option.taxon_id}
        options={options}
        value={val}
        getOptionSelected={option => option.taxon_id == val.taxon_id}
        onChange={handleOnChange}
        noOptionsText={!query ? 'Search...' : 'No options'}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(evt) => setQuery(evt.target.value)}
            size="small"
            variant="outlined"
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
        renderOption={(option) => formatOption(option, query)}
      />

      {error &&
        <FormHelperText error>
          There was a problem fetching taxon data.
          Please try to refresh/connect your browser or contact us if this issue persists.
        </FormHelperText>
      }
    </div>
  )
}
