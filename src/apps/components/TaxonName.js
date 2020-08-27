import React, { useState, useEffect} from 'react'
import styled from 'styled-components'

import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'

import AsyncSelect from 'react-select/async'
import highlightText from '../../utils/text'

import { queryTaxon } from '../../api/data-api'

import HelpIcon from '@material-ui/icons/HelpOutlineRounded'
import FormControlLabel from '@material-ui/core/FormControlLabel'


export default function TaxonName(props) {
  const {
    placeholder,
    noQueryText,
    onChange,
  } = props

  if (typeof props.value == 'undefined')
    throw (`TaxonNameInput component must have prop: value (even if null).  Was: ${props.value}`)

  const [value, setValue] = useState(props.value ? {taxon_name: props.value} : null) // internal value from here on
  const [query, setQuery] = useState(null)


  useEffect(() => {
    if (!props.value) return;

    _setTaxonName({taxon_name: props.value} )
  }, [props.value])


  const loadOptions = (query, callback) => {
    if (!query) {
      callback([])
      return;
    }

    queryTaxon({query})
      .then(data => callback(data))
  };

  const formatOptionLabel = opt => (
    <div>{opt.taxon_rank && `[${opt.taxon_rank}]`} {highlightText(opt.taxon_name, query || '')}</div>
  )

  const _setTaxonName = (obj) => {
    // note obj may be null
    setValue(obj)
    if (onChange) onChange(obj);
  }


  return (
    <Root>
      <InputLabel shrink htmlFor="taxon-name">
        Taxonomy Name{' '}
        <Tooltip
          title="Taxon must be specified at genus level or below to get the latest protein family predictions"
          placement="right"
        >
          <HelpIcon color="primary" className="hover" fontSize="small"/>
        </Tooltip>
      </InputLabel>

      <AsyncSelect
        id="taxon-name"
        isClearable
        cacheOptions
        defaultOptions
        placeholder={placeholder}
        loadOptions={loadOptions}
        styles={inputStyles}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={() => !query ? noQueryText : "No results"}
        onInputChange={val => setQuery(val)}
        onChange={obj => _setTaxonName(obj)}
        value={value}
      />
    </Root>
  )
}

const inputStyles = {
  menu: styles => ({
    ...styles,
    zIndex: 9999
  }),
  input: styles => ({
    ...styles,
    width: '300px'
  })
}

const Root = styled.div`
  margin-right: 10px;
`

/*
const Label = styled(InputLabel)`
  &.MuiInputLabel-root {
    position: relative;
    transform:  translate(14px, 10px) scale(0.75);
    position: relative;
    background: #fff;
    z-index: 10;
    width: min-content;
    white-space: nowrap;
  }
`
*/
