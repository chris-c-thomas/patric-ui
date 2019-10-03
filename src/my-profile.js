import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background
  },
  home: {
    margin: '40px',
    padding: '20px'
  }
}));


export default function Account() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Paper className={styles.home}>
        This is a stub for an account profile.
      </Paper>
    </div>
  )
}

