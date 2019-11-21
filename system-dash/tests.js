import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles(theme => ({
  root: {

  },
  card: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
  }
}));

export default function Tests() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Grid container>

        <Grid container item xs={12} direction="column">
          <Paper className={styles.card}>
            This is a place holder for end-to-end test results
          </Paper>
        </Grid>

      </Grid>
   </div>
  )
}

