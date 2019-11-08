import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  home: {
    margin: '40px',
    padding: '20px'
  }
}));


export default function Account() {
  const styles = useStyles();

  return (
    <div>
      <Paper className={styles.home}>
        This is a stub for an account profile.
      </Paper>
    </div>
  )
}

