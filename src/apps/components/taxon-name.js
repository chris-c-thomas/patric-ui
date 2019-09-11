import React, { useState, useEffect} from 'react';


import { InputLabel } from '@material-ui/core';
import AsyncSelect from 'react-select/async';
import highlightText from '../../utils/text'

import { queryTaxon } from '../../api/data-api';

import HelpIcon from '@material-ui/icons'

const inputStyles = {
  menu: styles => ({
    ...styles,
    zIndex: 9999
  }),
  input: styles => ({
    ...styles
  })
}

export default function TaxonNameInput(props) {
  const {placeholder, noQueryText, onChange, value} = props;

  if (typeof value == 'undefined')
    throw (`TaxonNameInput component must have prop: value.  Was: ${value}`);

  const [val, setVal] = useState(null);
  const [query, setQuery] = useState(null);

  console.log('value', value)

  // here allow the value to be set from outside this component
  useEffect(() => {
    if (!value) return;

    console.log('setting VAlue', value)
    setVal(value)
  }, [value])

  const loadOptions = (query, callback) => {
    if (!query) return;

    queryTaxon({query})
      .then(data => callback(data))
  };

  const formatOptionLabel = opt => (
    <div>[{opt.taxon_rank}] {highlightText(opt.taxon_name, query)}</div>
  )

  function handleChange(obj) {
    setVal(obj)
    if (onChange) onChange(obj);
  }

  return (
    <>
      <InputLabel shrink htmlFor="taxon-name">
        Taxonomy Name <HelpIcon />
      </InputLabel>
      <AsyncSelect
        id="taxon-name"
        cacheOptions
        placeholder={placeholder}
        loadOptions={loadOptions}
        styles={inputStyles}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={() => !query ? noQueryText : "No results"}
        onInputChange={val => setQuery(val)}
        onChange={obj => handleChange(obj)}
        value={val}
        className="taxon-selector"
      />
    </>
  );
}
