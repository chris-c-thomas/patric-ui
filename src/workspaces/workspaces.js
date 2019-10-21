import React, {useEffect, useState, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Link, useParams} from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


import Table from '../grids/mui-table';

import FileList from '../apps/components/object-selector/file-list';

import * as WS from '../api/workspace-api';

import {bytesToSize, toDateTimeStr} from '../utils/units';
import WSBreadCrumbs from '../utils/ui/ws-breadcrumbs';

import './workspaces.scss';

const columns = [
  {
    id: 'name',
    label: 'name',
  }, {
    id: 'size',
    label: 'size',
    format: val => bytesToSize(val)
  },
  {
    id: 'owner',
    label: 'Owner',
    format: val => val.split('@')[0]
  },
  {
    id: 'created',
    label: 'Created',
    format: val => toDateTimeStr(val)
  }
]


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
  let { path } = useParams();
  path = '/' + path;

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

  const [rows, setRows] = useState(null);
  const [total, setTotal] = useState(null);

  let { path } = useParams();
  path = '/' + path;


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
          path={path}
        />
      </Paper>
    </div>
  )
}

