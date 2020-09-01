import React, { useState, useEffect, useCallback } from 'react'

import { InputLabel } from '@material-ui/core'
import AsyncSelect from 'react-select/async'
import highlightText from '../../utils/text'

import { queryTaxonID } from '../../api/data-api'


const inputStyles = {
  menu: styles => ({
    ...styles,
    zIndex: 9999
  }),
  input: styles => ({
    ...styles,
    width: '125px'
  })
}

export default function TaxonIDInput(props) {
  const {placeholder, noQueryText, onChange} = props

  const [value, setValue] = useState(props.value ? {taxon_id: props.value} : null)
  const [query, setQuery] = useState(null)


  const _setTaxonId = useCallback((obj) => {
    // note obj may be null
    setValue(obj)
    if (onChange) onChange(obj)
  }, [onChange])


  useEffect(() => {
    if (!props.value) return

    _setTaxonId({taxon_isd: props.value} )
  }, [props.value, _setTaxonId])


  const loadOptions = (query, callback) => {
    if (!query) return

    queryTaxonID({query})
      .then(data => callback(data))
  }

  const formatOptionLabel = opt => (
    <div>
      {highlightText(opt.taxon_id, query || '')}{' '}
      {opt.taxon_name && `[${opt.taxon_name}]`}
    </div>
  )



  return (
    <div>
      <InputLabel shrink htmlFor="taxon-id">
        Taxonomy ID
      </InputLabel>
      <AsyncSelect
        id="taxon-id"
        cacheOptions
        placeholder={placeholder}
        loadOptions={loadOptions}
        styles={inputStyles}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={() => !query ? noQueryText : 'No results'}
        onInputChange={val => setQuery(val)}
        onChange={obj => _setTaxonId(obj)}
        value={value}
      />
    </div>
  )
}
