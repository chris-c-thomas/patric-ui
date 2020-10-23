import React, { useState, useEffect } from 'react'

import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Tooltip from '@material-ui/core/Tooltip'
import HelpIcon from '@material-ui/icons/HelpOutline'
import highlightText from '../../utils/text'

import { queryTaxon } from '../../api/data-api'



const formatOption = (opt, query) => (
  <div>{opt.taxon_rank && `[${opt.taxon_rank}]`} {highlightText(opt.taxon_name, query || '')}</div>
)


type Props = {
  value: string;
  placeholder?: string;
  onChange: (object: {taxon_name: string}) => void;
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
  const [val, setVal] = useState(value ? {taxon_name: value} : null)


  // allow the value to be set from outside this component
  useEffect(() => {
    setVal(value ? {taxon_name: value} : null)
  }, [value])


  // request on query
  useEffect(() => {
    (async () => {
      let q = !query.length ? 'bacteria' : query

      let data
      try {
        setLoading(true)
        data = await queryTaxon({query: q})
      } catch (err) {
        setError(err)
      }

      setOptions(data)
      setLoading(false)
    })()
  }, [query])


  const handleOnChange = (evt, value) => {
    onChange(value ? value : null)
  }


  return (
    <div>
      <InputLabel shrink htmlFor="taxon-name">
          Taxonomy Name{' '}
        <Tooltip
          title="Taxon must be specified at genus level or below to get the latest protein family predictions"
          placement="right"
        >
          <HelpIcon color="primary" className="hover" fontSize="small"/>
        </Tooltip>
      </InputLabel>

      <Autocomplete
        autoComplete
        style={{ width: 350, marginRight: 10 }}
        getOptionLabel={option =>  option.taxon_name}
        options={options}
        value={val}
        getOptionSelected={option => option.taxon_name == val.taxon_name}
        onChange={handleOnChange}
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




