import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Subtitle from './subtitle';

import SortAlphaIcon from '@material-ui/icons/SortByAlphaRounded';
import SortIcon from '@material-ui/icons/Sort';

import {getStats} from '../api/app-service';

import {sortBy} from '../utils/process';

import './jobs-overview.scss';

const noSpaceList = ['RNA'];

const formatAppName = (name) => {
  return noSpaceList.map(str =>
    name.replace(str, '##').replace(/([A-Z])/g, ' $1').replace('##', str)
  )
}

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
  const max = Math.max(...data.map(o => o.value));

  return (
    <ul style={{listStyle: 'none', padding: 0}}>
      {
        data.map(obj => {
          const {value, label, id} = obj;
          return (
            <li key={obj.id}>
              <Link to={`/jobs/${id}`} className="flex facet">
                <span>{formatAppName(label)}</span>
                <span style={{marginRight: '5px'}}>{value}</span>
                <span style={facetBar(value, max)} className="facet-bar"></span>
              </Link>
            </li>
          )
        })

      }
    </ul>
  )
}

export default function JobsOverview(props) {
  const {styles} = props;

  const [stats, setStats] = useState(null);
  const [sort, setSort] = useState(false);

  useEffect(() => {
    getStats()
      .then(stats => setStats(stats))
  }, [])

  const sortList = (alpha) => {
    setStats(alpha ? sortBy(stats, 'label') : sortBy(stats, 'value', true));
    setSort(!sort);
  }

  return (
    <Paper className={styles.card}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Subtitle>
            My Jobs <small>| <Link to="/jobs/">view all</Link></small>
          </Subtitle>
        </Grid>
        <Grid item>
          <Tooltip title={`sort ${sort ? 'by count' : 'alphabetically'}`} placement="left">
            <IconButton
              onClick={() => sortList(!sort)}
              size="small"
              disableRipple
            >
              {sort ? <SortIcon /> : <SortAlphaIcon />}
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {
        stats &&
        <JobCounts data={stats} />
      }
    </Paper>
  )
}