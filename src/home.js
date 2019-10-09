import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

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


export default function Home() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Paper className={styles.home}>
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

