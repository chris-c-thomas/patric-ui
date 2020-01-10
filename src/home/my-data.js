import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import Subtitle from './subtitle';

import WSTree from './ws-tree';

import { getUser } from '../api/auth';
import {getUserCounts} from '../api/workspace';



export default function MyData(props) {
  const {styles} = props;


  const [counts, setCounts] = useState(null);

  useEffect(() => {
    getUserCounts({user: getUser()})
      .then(counts => setCounts(counts));
  }, [])

  return (
    <Paper className="card">
      {!counts && <LinearProgress className="card-progress"/>}
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Subtitle>
            My Data
          </Subtitle>
        </Grid>
        <Grid item>
        </Grid>
      </Grid>

      <WSTree counts={counts}/>
    </Paper>
  )
}