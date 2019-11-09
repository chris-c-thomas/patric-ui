import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

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

export default function SystemStatus() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Grid container>

        <Grid container item xs={8} direction="column">
          blah
        </Grid>

        <Grid container item xs={4} direction="column">
          another container
        </Grid>

      </Grid>
   </div>
  )
}

