import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import SortAlphaIcon from '@material-ui/icons/SortByAlphaRounded';
import SortIcon from '@material-ui/icons/Sort';

import Subtitle from '../subtitle';
import { getStats } from '../api/app-service';

import { sortBy } from '../utils/process';

import './jobs-overview.scss';


const formatAppName = (name) =>
  name.replace(/\w\S*/g, function(str) {
    return str.charAt(0).toUpperCase() + str.substr(1)
  }).replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')


const facetBar = (val, max) => {
  const percent = val / max * 100;
  return {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    height: '95%',
    background: '#f2f2f2',
    width: `calc(${percent}%)`,
    zIndex: -1,
    borderRadius: 2
  }
}


const JobCounts = (props) => {
  const {data} = props;
  const max = Math.max(...data.map(o => o.count));

  return (
    <ul style={{listStyle: 'none', padding: 0}}>
      {
        data.map(obj => {
          const {label, value, count} = obj;
          return (
            <li key={obj.label}>
              <Link to={`/jobs/?app=${value}`} className="flex facet">
                <span>{formatAppName(value)}</span>
                <span style={{marginRight: '5px'}}>{count}</span>
                <span style={facetBar(count, max)} className="facet-bar"></span>
              </Link>
            </li>
          )
        })

      }
    </ul>
  )
}


const SortBtn = (props) => {
  const {title, onClick, sort} = props;
  return (
    <Tooltip title={title} placement="left">
      <IconButton
        onClick={onClick}
        size="small"
        disableRipple
      >
        {sort ? <SortIcon /> : <SortAlphaIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default function JobsOverview(props) {
  const [stats, setStats] = useState(null);
  const [sort, setSort] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStats()
      .then(stats => setStats(stats))
      .then(err => setError(err))
  }, [])

  const sortList = (alpha) => {
    setStats(alpha ? sortBy(stats, 'label') : sortBy(stats, 'value', true));
    setSort(!sort);
  }

  return (
    <Paper className="card">
      {!stats && <LinearProgress className="card-progress"/>}
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Subtitle>
            <Link to="/jobs/">My Jobs</Link>
          </Subtitle>
        </Grid>
        <Grid item>
          <SortBtn title={`sort ${sort ? 'by count' : 'alphabetically'}`}
            onClick={() => sortList(!sort)}
            sort={sort}
          />
        </Grid>
      </Grid>

      {stats && <JobCounts data={stats} />}
      {error && <span>{error.message}</span>}
    </Paper>
  )
}