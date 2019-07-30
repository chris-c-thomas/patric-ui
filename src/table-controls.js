
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

// icons
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigatBeforeIcon from '@material-ui/icons/NavigateBefore';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import DownloadIcon from '@material-ui/icons/CloudDownloadOutlined';
import FilterIcon from '@material-ui/icons/FilterListRounded';


import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import useDebounce from './utils/use-debounce';

import ColumnMenu from './column-menu';

const useStyles = makeStyles(theme => ({
  btnGroup: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  container: {
    margin: theme.spacing(1)
  },
  menuBtn: {
    position: 'relative',
    zIndex: 1000
  },
  menu: {
    position: 'absolute',
    top: 36,
    right: 0,
    left: 0,
  },
}));


export default function TableControls(props) {
  const styles = useStyles();
  const {onChange, total, columns, onColumnChange} = props;

  const [isLoading, loading] = useState(false);
  const limit = 200;

  let started = false;
  const [query, setQuery] = useState(null);
  const [start, setPage] = useState(1);
  const debounceQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!started) return;

    loading(true);
    onChange({query, start, limit}).then(() => {
      loading(false);
    })
  }, [debounceQuery, start]);

  started = true;

  return (
    <Grid container className={styles.container}>
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

      <Grid item container xs={6} justify="flex-end" alignItems="center" spacing={3}>
        <div>
          {start} - {start + limit - 1 > total ? total : start + limit - 1} of {total}
        </div>

        <ButtonGroup size="small" aria-label="table paging" color="primary"
          className={styles.btnGroup} disableRipple>
          <Button onClick={() => setPage(start - limit)} disabled={start - limit < 1}>
            <NavigatBeforeIcon /> prev
          </Button>
          <Button onClick={() => setPage(start + limit)} disabled={start + limit > total}>
            next <NavigateNextIcon />
          </Button>
        </ButtonGroup>

        <ColumnMenu columns={columns} onColumnChange={onColumnChange} />

      </Grid>
    </Grid>
  )
};