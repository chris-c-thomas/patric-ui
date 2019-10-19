import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";


import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background
  },
  homeCard: {
    margin: '0 10px',
    padding: '20px',
    height: 'calc(100% - 100px)'
  }
}));


export default function Home() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Paper className={styles.homeCard}>
        <h4>This is a stub for a homepage.</h4>

        <h5>Service Demos</h5>
        <ul>
          <li><Link to="/apps/assembly">Assembly</Link></li>
          <li><Link to="/apps/annotation">Annotation</Link></li>
        </ul>
      </Paper>
    </div>
  )
}

