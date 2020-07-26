
import React, { useState, useEffect } from 'react';

import Progress from '@material-ui/core/LinearProgress';
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

  const [isLoading, loading] = useState(props.loading);
  const limit = 200;

  let started = false;
  const [query, setQuery] = useState(null);
  const [start, setPage] = useState(1);
  const debounceQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!started) return;

    onSearch({query, start, limit, page: start - 1})
  }, [debounceQuery, start]);

  started = true;

  return (
    <Grid container>
      {isLoading && <Progress className="card-progress"/>}

      <Grid item xs={4}>
        <Input
          placeholder={searchPlaceholder || 'Search keywords'}
          onChange={e => { setQuery(e.target.value); setPage(1); }}
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