import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import AsyncSelect from 'react-select/async';
import highlightText from '../../utils/text'

import { queryTaxon } from '../../api/data-api';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 290
  }
}));

const inputStyles = {
  menu: styles => ({
    ...styles,
    zIndex: 9999
  }),
  input: styles => ({
    ...styles,
    minWidth: '100px'
  })
}

export default function TaxonIDInput(props) {
  const styles = useStyles();

  const {placeholder, label} = props;

  const [items, setItems] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [query, setQuery] = useState(null);

  const filterItems = () => {
    return items.filter(i =>
      i.value.toLowerCase().includes(query.toLowerCase())
    );
  };

  const loadOptions = (query, callback) => {
    if (!query) return;

    console.log('query', query)
    queryTaxon({query})
      .then(data => {
        setItems(data)
        callback(data)
      })
  };

  const formatOptionLabel = (opt) => {
    let label = opt.label,
      i = label.lastIndexOf('/') + 1,
      path = label.slice(0, i)
      name = label.slice(i);

    return (
      <div>
        <small>
          {query ?  highlightText(path, query) : path}
        </small><br/>
        <b>{query ?  highlightText(name, query) : name}</b>
      </div>
    );
  }


  return (
    <div className={styles.root}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <AsyncSelect
            cacheOptions
            defaultOptions
            placeholder={placeholder}
            loadOptions={loadOptions}
            styles={inputStyles}
            formatOptionLabel={formatOptionLabel}
            noOptionsMessage={() => "No results"}
            onInputChange={val => setQuery(val)}
            onChange={obj => setSelectedPath(obj)}
            value={selectedPath}
          />
        </Grid>

        <Grid item>

        </Grid>
      </Grid>
    </div>
  );
}
