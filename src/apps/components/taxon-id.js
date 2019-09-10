import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { InputLabel } from '@material-ui/core';
import AsyncSelect from 'react-select/async';
import highlightText from '../../utils/text'

import { queryTaxonID } from '../../api/data-api';


const inputStyles = {
  menu: styles => ({
    ...styles,
    zIndex: 9999
  }),
  input: styles => ({
    ...styles
  })
}

export default function TaxonIDInput(props) {
  const {placeholder, label, noQueryText, onChange} = props;
  const [value, setValue] = useState(null);
  const [query, setQuery] = useState(null);

  const loadOptions = (query, callback) => {
    if (!query) return;

    queryTaxonID({query})
      .then(data => callback(data));
  };

  const formatOptionLabel = opt => (
    <div>{highlightText(opt.taxon_id, query)} [{opt.taxon_name}]</div>
  )

  function handleChange(obj) {
    setValue(obj)
    if (onChange) onChange(obj);
  }

  return (
    <>
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
        noOptionsMessage={() => !query ? noQueryText : "No results"}
        onInputChange={val => setQuery(val)}
        onChange={obj => handleChange(obj)}
        value={value}
      />
    </>
  );
}
