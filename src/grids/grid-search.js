
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
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



const toLocale = str => str ? str.toLocaleString() : ''

export default function TableControls(props) {
  const {onSearch, total, columns, onColumnChange} = props;

  const [isLoading, loading] = useState(false);
  const limit = 200;

  let started = false;
  const [query, setQuery] = useState(null);
  const [start, setPage] = useState(1);
  const debounceQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!started) return;

    loading(true);
    onSearch({query, start, limit}).then(() => {
      loading(false);
    })
  }, [debounceQuery, start]);

  started = true;

  return (
    <Grid container>
      {isLoading && <Progress className="card-progress"/>}

      <Grid item xs={4}>
        <Input
          placeholder="Search genomes"
          onChange={e => { setQuery(e.target.value); setPage(1); }}
          fullWidth
          startAdornment={<InputAdornment position="start"><SearchIcon/></InputAdornment>}
        />
      </Grid>

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

        {isLoading && <CircularProgress size={22} disableShrink={true} />}
      </Grid>
    </Grid>
  )
};