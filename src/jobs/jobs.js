import React, {useEffect, useState, useContext} from 'react';
import styled from 'styled-components'
import { Link, useHistory, useLocation} from "react-router-dom";

import Select from 'react-select'

// import 'date-fns';
// import {KeyboardDatePicker, MuiPickersUtilsProvider}  from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueuedIcon from '@material-ui/icons/PlaylistAddTwoTone';
import InProgressIcon from '@material-ui/icons/PlaylistPlayTwoTone';
import CompletedIcon from '@material-ui/icons/PlaylistAddCheckTwoTone';
import WarningIcon from '@material-ui/icons/WarningOutlined';

import Table from '../tables/table';
import { listJobs, getStats } from '../api/app-service';
import { toDateTimeStr } from '../utils/units';

import { JobStatusProvider, JobStatusContext } from "./job-status-context";

import ErrorMsg from '../error-msg';

import urlMapping from './url-mapping';


const columns = [
  {
    id: 'status',
    label: 'Status',
    format: val => <b className={val}>{val}</b>,
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
  const {
    app, onAppFilter, status, onStatusFilter, options
  } = props;

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={1}>
        <Title>Job Status</Title>
      </Grid>

      <Grid item xs={3}>
        <Select
          styles={{
            menu: (provided, state) => ({
              ...provided,
              zIndex: 99999
            })
          }}
          defaultValue={app ? {label: app, value: app} : { label: "All Services", value: 'AllServices' }}
          options={options}
          onChange={field => onAppFilter(field)}
        />

        {/*
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            label="Date picker inline"
            // value={selectedDate}
            onChange={onStartDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />

          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            label="Date picker inline"
            // value={selectedDate}
            onChange={onEndDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        */}

      </Grid>

      <Grid item xs={2}>
        <StatusBtn onClick={() => onStatusFilter('queued')} active={status == 'queued'}>
          <QueuedIcon className="queued" />
          <p>{state.queued} queued</p>
        </StatusBtn>
      </Grid>

      <Grid item xs={2}>
        <StatusBtn onClick={() => onStatusFilter('in-progress')} active={status == 'in-progress'}>
          <InProgressIcon className="in-progress" />
          <p>{state.inProgress} in progress</p>
        </StatusBtn>
      </Grid>

      <Grid item xs={2}>
        <StatusBtn onClick={() => onStatusFilter('completed')} active={status == 'completed'}>
          <CompletedIcon className="completed"/>
          <p>{state.completed} completed</p>
        </StatusBtn>
      </Grid>

      <Grid item xs={2}>
        <StatusBtn onClick={() => onStatusFilter('failed')} active={status == 'failed'}>
          <WarningIcon className="failed"/>
          <p>{state.failed} failed</p>
        </StatusBtn>
      </Grid>
    </Grid>
  )
}


export default function Jobs() {
  let history = useHistory();
  const params = new URLSearchParams(useLocation().search)

  const appFilter = params.get('app')
  const app = appFilter == 'AllServices' ? null : appFilter
  const status = params.get('status')
  const page = params.get('page') || 0
  const query = params.get('query') || ''
  const limit = params.get('limit') || 200

  const [loading, setLoading] = useState(false)
  // const [state, setState] = useState({app: 'AllServices'}) //page: 0, start: 0, limit: 200,
  const [rows, setRows] = useState(null);
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(null);
  const [appStats, setAppStats] = useState(null)


  useEffect(() => {
    setLoading(true)

    let params = {
      start: page * limit,
      simpleSearch: {
        app,  // from url state
        status,
        search: query
      }
    }
    listJobs(params).then(data => {
      setRows(data.jobs)
      setTotal(data.total)
      setLoading(false)
    }).catch(err => {
      setError(err)
      setLoading(false)
    })

  }, [page, status, app, query])


  // data for app filter dropdown
  useEffect(() => {
    getStats().then(res => setAppStats(
      [{label: `All Services`, value: 'AllServices'}, ...res]
    ))
  }, [])


  const onAppFilter = ({value}) => {
    params.set('app', value)
    history.push({search: params.toString()})
  }

  const onRmAppFilter = () => {
    params.delete('app')
    history.push({search: params.toString()})
  }

  const onStatusFilter = (value) => {
    // allow deselect
    if (status == value) {
      onRmStatusFilter()
      return
    }
    params.set('status', value)
    history.push({search: params.toString()})
  }

  const onRmStatusFilter = () => {
    params.delete('status')
    history.push({search: params.toString()})
  }

  const onPage = (page) => {
    params.set('page', page)
    history.push({search: params.toString()})
  }

  const onSearch = ({query}) => {
    if (!query) params.delete('query')
    else params.set('query', `${query}`)
    history.push({search: params.toString()})
  }

  const onSort = (colObj) => {
    alert('no api method available')
  }


  return (
    <>
      <Card>
        <JobStatusProvider>
          <Toolbar
            options={appStats}
            app={app}
            onAppFilter={onAppFilter}
            status={status}
            onStatusFilter={onStatusFilter}
          />
        </JobStatusProvider>
      </Card>

      <TableCard>
        {loading && <LinearProgress className="card-progress" /> }
        {
          rows &&
          <Table
            offsetHeight="60px"
            pagination
            page={page}
            limit={limit}
            columns={columns}
            rows={rows}
            total={total}
            onPage={onPage}
            onSort={onSort}
            onSearch={onSearch}
            searchPlaceholder={'Search files and parameters'}
            MiddleComponent={() => (
              <>
              {app && app !== 'AllServices' &&
                <Chip size="small"
                  label={<><b>Service:</b> {app}</>}
                  onDelete={onRmAppFilter}
                  color="primary"
                />
              }
              {status &&
                <Chip size="small"
                  label={<><b>Status:</b> {status}</>}
                  onDelete={onRmStatusFilter}
                  color="primary"
                />
              }
             </>
            )}
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
  padding: 0 10px;
  position: relative;
`

const Title = styled.div`
  font-size: 1.2em;
`

const StatusBtn = styled.a`
  color: #444;
  display: flex;
  align-items: center;

  & > svg {
    font-size: 2rem;
  }

  :hover {
    color: #444;
    opacity: .8;
    text-decoration: none;
  }

  ${props => props.active &&
    'border-bottom: 3px solid #c0d3a2;'
  }
`

const Icon = styled.span`

`
