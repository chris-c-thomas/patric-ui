import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Subtitle from './subtitle';

import {getStats} from '../api/app-service';



export default function News(props) {
  const {styles} = props;

  const [stats, setStats] = useState(null);
  const [sort, setSort] = useState(false);

  useEffect(() => {

  }, [])



  return (
    <Paper className={styles.card}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Subtitle>
            News <small>| <Link to="/jobs/">view all</Link></small>
          </Subtitle>
        </Grid>
        <Grid item>

        </Grid>
      </Grid>
    </Paper>
  )
}