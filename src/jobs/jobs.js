import React, {useEffect, useState, useContext} from 'react';
import styled from 'styled-components'
import { Link, useParams, useHistory } from "react-router-dom";

import Select from 'react-select'

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueuedIcon from '@material-ui/icons/PlaylistAddTwoTone';
import InProgressIcon from '@material-ui/icons/PlaylistPlayTwoTone';
import CompletedIcon from '@material-ui/icons/PlaylistAddCheckTwoTone';

import Table from '../tables/table';
import { listJobs, getStats } from '../api/app-service';
import { toDateTimeStr } from '../utils/units';

import { JobStatusProvider, JobStatusContext } from "./job-status-context";

import ErrorMsg from '../error-msg';

import './jobs.scss';
import urlMapping from './url-mapping';


const columns = [
  {
    id: 'status',
    label: 'Status',
    format: val => <span className={`${val} status-text`}>{val}</span>,
    width: '100px'
  },
  {
    id: 'app',
    label: 'Service',
    format: val => {
      const isAvail = Object.keys(urlMapping).indexOf(val) != -1;
      return isAvail ? <Link to={`/apps/${urlMapping[val]}`}>{val}</Link> : val;
    },
    width: '20%'
  },
  {
    id: 'id',
    label: 'Job ID',
    format: val => Number(val),
    width: '60px'
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
    id: 'submit_time',
    label: 'Submitted',
    format: val => toDateTimeStr(val)
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


function Toolbar(props) {
  const [state] = useContext(JobStatusContext);
  const {app, onFilterChange, options} = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs={2}>
        <Typography variant="h6" component="h3">
          Job Status
        </Typography>
        {
          app && <>
            <Chip size="small"
              label={app}
              onDelete={onFilterChange(app)}
              color="primary"
            />
          </>
        }
      </Grid>

      <Grid item xs={4}>
        <Select
          styles={{
            menu: (provided, state) => ({
              ...provided,
              zIndex: 99999
            })
          }}
          options={options}
          onChange={field => onFilterChange(field)}
        />
      </Grid>

      <Grid item xs={2}>
        <Icon><QueuedIcon className="queued" /></Icon>
        <span>{state.queued}<br/>queued</span>
      </Grid>

      <Grid item xs={2}>
        <Icon><InProgressIcon className="in-progress" /></Icon>
        <span>{state.inProgress}<br/>in progress</span>
      </Grid>

      <Grid item xs={2}>
        <Icon><CompletedIcon className="completed"/></Icon>
        <span>{state.completed}<br/>completed</span>
      </Grid>
    </Grid>
  )
}


export default function Jobs() {
  const { app } = useParams();
  let history = useHistory();

  const [loading, setLoading] = useState(false)
  const [state, setState] = useState({page: 0, start: 0, limit: 200, sort: null})
  const [rows, setRows] = useState(null);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(null);

  // param from url that filters by app
  const [appFilter, setAppFilter] = useState(app);

  const [apps, setApps] = useState(null)

  useEffect(() => {
    setLoading(true)

    let params = app ? {...state, query: {app}} : state
    listJobs(params).then(data => {
      setRows(data.jobs)
      setTotal(data.total)
      setLoading(false)
    }).catch(err => {
      setError(err)
      setLoading(false)
    })

  }, [state])


  useEffect(() => {
    if (!appFilter) return

    history.push(`/jobs/${appFilter}`)
  }, [appFilter])


  useEffect(() => {
    getStats().then(res => setApps(res))
  }, [])

  const onFilterChange = (app) => {
    if (!app.value) return

    setAppFilter(app.value)
  }

  const onSort = (colObj) => {
    setState(prev => ({...prev, sort: `+${colObj.id}`}) )
  }


  return (
    <>
      <Card>
        <JobStatusProvider>
          <Toolbar app={app} onFilterChange={onFilterChange} options={apps} />
        </JobStatusProvider>
      </Card>

      <TableCard>
        {loading && <LinearProgress className="card-progress" /> }
        {
          rows &&
          <Table
            offsetHeight="80px"
            pagination
            page={state.page}
            limit={state.limit}
            columns={columns}
            rows={rows}
            total={total}
            onPage={state => setState(state)}
            onSort={onSort}
          />
        }
        {error && <ErrorMsg error={error} />}

      </TableCard>
    </>
  )
}


const Card = styled(Paper)`
  margin: 5px;
  padding: 20px;
`

const TableCard = styled(Paper)`
  height: calc(100% - 160px);
  margin: 5px;
  position: relative;
`

const Icon = styled.span`
  font-size: 2em;
  display: inline-block;
`
