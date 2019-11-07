import React, {useEffect, useState, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Link, useParams } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import QueuedIcon from '@material-ui/icons/PlaylistAddTwoTone';
import InProgressIcon from '@material-ui/icons/PlaylistPlayTwoTone';
import CompletedIcon from '@material-ui/icons/PlaylistAddCheckTwoTone';
import DoneIcon from '@material-ui/icons/DoneRounded';

import Table from '../grids/mui-table';
import { listJobs } from '../api/app-service';
import { toDateTimeStr } from '../utils/units';

import { JobStatusProvider, JobStatusContext } from "./job-status-context";

import './jobs.scss';
import urlMapping from './url-mapping';

const columns = [
  {
    id: 'status',
    label: 'Status',
    format: val => {
      return <span className={`${val} status-text`}>{val}</span>
    }
  }, {
    id: 'submit_time',
    label: 'Submitted',
    format: val => toDateTimeStr(val)
  },
  {
    id: 'app',
    label: 'Service',
    format: val => {
      const isAvail = Object.keys(urlMapping).indexOf(val) != -1;
      return isAvail ? <Link to={`/apps/${urlMapping[val]}`}>{val}</Link> : val;
    }
  },
  {
    id: 'parameters',
    label: 'Output Name',
    format: obj => {
      const isAvail = 'output_file' in obj;
      if (!isAvail) return '-';

      const name = obj.output_file,
            path = `${obj.output_path}/.${name}`;
      return  <Link to={`/files${path}`}>{name}</Link>;
    }
  }, {
    id: 'start_time',
    label: 'Started',
    format: val => toDateTimeStr(val)
  }, {
    id: 'completed_time',
    label: 'Completed',
    format: val => toDateTimeStr(val)
  }
]


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background
  },
  card: {
    margin: '5px',
    padding: '20px'
  },
  tableCard: {
    height: 'calc(100% - 150px)',
    margin: '5px'
  },
  icon: {
    fontSize: '2em',
    display: 'inline-block'
  },
}));


function Overview(props) {
  const [state] = useContext(JobStatusContext);
  const {filterState, onFilterChange} = props;


  const styles = useStyles();
  return (
    <Grid container>
      <Grid item xs={3}>
        <Typography variant="h6" component="h3">
          Job Status
        </Typography>
        {
          app && <>
            <Chip size="small"
              label={filterState}
              onDelete={onFilterChange(filterState)}
              color="primary"
            />
          </>
        }
      </Grid>

      <Grid item xs={3}>
        <QueuedIcon className={clsx(styles.icon, 'queued')}/>
        <span className={styles.status}>{state.queued}<br/>queued</span>
      </Grid>

      <Grid item xs={3}>
        <InProgressIcon className={clsx(styles.icon, 'in-progress')}/>
        <span className={styles.status}>{state.inProgress}<br/>in progress</span>
      </Grid>

      <Grid item xs={3}>
        <CompletedIcon className={clsx(styles.icon, 'completed')}/>
        <span className={styles.status}>{state.completed}<br/>completed</span>
      </Grid>
    </Grid>
  )
}



export default function Jobs() {
  const styles = useStyles();
  const { app } = useParams();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(null);
  const [total, setTotal] = useState(null);

  const [filterState, setFilterState] = useState(app);

  const limit = 200;

  useEffect(() => {
    const start = page * limit;
    listJobs({start, limit, query: {app}}).then(data => {
      setRows(data.jobs)
      setTotal(data.total)
    })
  }, [page])


  function onFilterChange(app) {

  }

  return (
    <div className={styles.root}>
      <Paper className={styles.card}>
        <JobStatusProvider>
          <Overview filterState={filterState} onFilterChange={onFilterChange} />
        </JobStatusProvider>
      </Paper>

      <Paper className={styles.tableCard}>
        {
          rows &&
          <Table
            columns={columns}
            rows={rows}
            page={page}
            total={total}
            onPage={page => setPage(page)}
          />
        }

      </Paper>
    </div>
  )
}

