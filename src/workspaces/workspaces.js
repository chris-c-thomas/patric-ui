import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams} from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import FileList from './file-list';

import WSBreadCrumbs from '../utils/ui/ws-breadcrumbs';

import './workspaces.scss';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background
  },
  overview: {
    margin: '5px',
    padding: '20px 10px',
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  },
  tableCard: {
    height: 'calc(100% - 100px)',
    margin: '5px'
  },
  icon: {
    fontSize: '2em',
    display: 'inline-block'
  },
}));


function Overview(props) {
  return (
    <Grid container>
      <Grid item xs={9}>
        <WSBreadCrumbs/>
      </Grid>
    </Grid>
  )
}



export default function Workspaces() {
  const styles = useStyles();



  function onSelect() {
  }

  return (
    <div className={styles.root}>
      <Paper className={styles.tableCard}>
        <div className={styles.overview}>
          <Overview />
        </div>

        <FileList
          onSelect={onSelect}
          noBreadCrumbs={true}
        />
      </Paper>
    </div>
  )
}

