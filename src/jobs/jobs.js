/* eslint-disable react/display-name */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import { Link, useHistory, useLocation} from 'react-router-dom'

import Select from 'react-select'

// import 'date-fns';
// import {KeyboardDatePicker, MuiPickersUtilsProvider}  from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';

import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import LinearProgress from '@material-ui/core/LinearProgress'
import QueuedIcon from '@material-ui/icons/List'
import InProgressIcon from '@material-ui/icons/PlayCircleOutlineRounded'
import CompletedIcon from '@material-ui/icons/CheckOutlined'
import WarningIcon from '@material-ui/icons/WarningOutlined'

import Table from '../tables/Table'
import { listJobs, getStats } from '../api/app-service'
import { isoToHumanDateTime } from '../utils/units'

import { JobStatusContext } from './job-status-context'

import ErrorMsg from '../error-msg'

import urlMapping from './url-mapping'


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
      const isAvail = Object.keys(urlMapping).indexOf(val) != -1
      return isAvail ? <Link to={`/apps/${urlMapping[val]}`}>{val}</Link> : val
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
    label: 'Output',
    format: obj => {
      const isAvail = 'output_file' in obj
      if (!isAvail) return '-'

      const name = obj.output_file,
        path = `${obj.output_path}/.${name}`
      return  <Link to={`/files${path}`}>{name}</Link>
    }
  }, {
    id: 'submit_time',
    label: 'Submitted',
    format: val => isoToHumanDateTime(val)
  }, {
    id: 'start_time',
    label: 'Started',
    format: val => isoToHumanDateTime(val)
  }, {
    id: 'completed_time',
    label: 'Completed',
    format: val => isoToHumanDateTime(val)
  }
]


function Toolbar(props) {
  const [state] = useContext(JobStatusContext)
  const {
    app, onAppFilter, status, onStatusFilter, options
  } = props


  return (
    <div className="row">
      <MainOptions className="flex align-items-center">
        <Title>Job Status</Title>
        <div style={{width: 300}}>
          <Select
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 99999,
              })
            }}
            defaultValue={app ? {label: app, value: app} : { label: 'All Services', value: 'AllServices' }}
            options={options}
            onChange={field => onAppFilter(field)}
          />
        </div>
      </MainOptions>

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
      <StatusBtns className="flex align-items-end">
        <StatusBtn onClick={() => onStatusFilter('queued')} isactive={status == 'queued'} disableRipple>
          <QueuedIcon className="queued" />
          {state.queued} queued
        </StatusBtn>

        <StatusBtn onClick={() => onStatusFilter('in-progress')} isactive={status == 'in-progress'} disableRipple>
          <InProgressIcon className="in-progress" />
          {state.inProgress} running
        </StatusBtn>

        <StatusBtn onClick={() => onStatusFilter('completed')} isactive={status == 'completed'} disableRipple>
          <CompletedIcon className="completed"/>
          {state.completed} completed
        </StatusBtn>

        <StatusBtn onClick={() => onStatusFilter('failed')} isactive={status == 'failed'} disableRipple>
          <WarningIcon className="failed"/>
          {state.failed} failed
        </StatusBtn>
      </StatusBtns>
    </div>
  )
}

const MainOptions = styled.div`
  flex-grow: 3;
`

const Title = styled.div`
  font-size: 1.2em;
  margin-right: 20px;
`

const StatusBtns = styled.div`
  flex-grow: 1;

  & > * {
    margin-right: 40px;
  }
`

const StatusBtn = styled(Button)`
  padding: 0;
  color: #444;
  &.MuiButton-root { margin-right: 20px;}

  :hover { opacity: .8;}

  ${props => props.isactive &&
    'border-bottom: 10px solid #c0d3a2;'}
`



export default function Jobs() {
  let history = useHistory()
  const params = new URLSearchParams(useLocation().search)

  const appFilter = params.get('app')
  const app = appFilter == 'AllServices' ? null : appFilter
  const status = params.get('status') || false
  const page = Number(params.get('page')) || 0
  const query = params.get('query') || ''
  const limit = Number(params.get('limit')) || 200

  const [loading, setLoading] = useState(false)
  // const [state, setState] = useState({app: 'AllServices'}) //page: 0, start: 0, limit: 200,
  const [rows, setRows] = useState(null)
  const [total, setTotal] = useState(null)
  const [error, setError] = useState(null)
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

  }, [page, status, app, query, limit])


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

  const onSort = (/*colObj*/) => {
    alert('no api method available')
  }


  return (
    <>
      <Card>
        <Toolbar
          options={appStats}
          app={app}
          onAppFilter={onAppFilter}
          status={status}
          onStatusFilter={onStatusFilter}
        />

      </Card>

      <TableCard>
        {loading && <LinearProgress className="card-progress" /> }
        {
          rows &&
          <Table
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
              <Filters>
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
              </Filters>
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
  padding: 10px;
`

const TableCard = styled(Paper)`
  height: calc(100% - 120px);
  margin: 5px;
  padding: 0 10px;
  position: relative;
`

const Filters = styled.div`
  margin-left: 10px;
  > .MuiChip-root {
    margin-right: 10px;
  }
`

