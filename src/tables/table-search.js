
import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';

// icons
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import DownloadIcon from '@material-ui/icons/CloudDownloadOutlined';
import FilterIcon from '@material-ui/icons/FilterListRounded';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import useDebounce from '../utils/use-debounce';



export default function TableControls(props) {
  const {onSearch, enableTableOptions, searchPlaceholder} = props;

  const [query, setQuery] = useState(null);
  const debounceQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch({query})
  }, [debounceQuery]);

  return (
    <Grid container>
      <Grid item xs={4}>
        <Input
          placeholder={searchPlaceholder || 'Search keywords'}
          onChange={e => { setQuery(e.target.value); }}
          fullWidth
          startAdornment={<InputAdornment position="start"><SearchIcon/></InputAdornment>}
        />
      </Grid>

      {
        enableTableOptions &&
        <Grid item xs={2}>
          <Tooltip title="filter">
            <IconButton aria-label="filter">
              <FilterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="download">
            <IconButton aria-label="download">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      }

    </Grid>
  )
};