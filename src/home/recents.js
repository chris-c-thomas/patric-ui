import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Subtitle from '../subtitle';


export default function Recents(props) {
  const {styles} = props;
  const [stats, setStats] = useState(null);
  const [sort, setSort] = useState(false);

  useEffect(() => {

  }, [])


  return (
    <Paper className="card">
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Subtitle>
            <a onClick={() => alert('not implemented')}>Recent Activity</a>
          </Subtitle>
        </Grid>
        <Grid item>

        </Grid>
      </Grid>
    </Paper>
  )
}