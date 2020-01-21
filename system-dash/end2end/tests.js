import React, {useState, useEffect, useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Progress from '@material-ui/core/LinearProgress';
import CheckIcon from '@material-ui/icons/CheckCircleRounded'
import WarningIcon from '@material-ui/icons/WarningRounded'
import Chip from '@material-ui/core/Chip'

import Table from '../../src/grids/mui-table'
import { getEnd2EndLog } from '../api/log-fetcher'
import { msToTimeStr } from '../../src/utils/units';
import Subtitle from '../../src/home/subtitle';
import Dialog from '../../src/dialogs/basic-dialog';

import {months} from '../../src/utils/dates';


const columns = [
  {
    id: 'testFilePath',
    label: 'File',
  }, {
    id: 'perfStats',
    label: 'Duration',
    format: obj => msToTimeStr(obj.end - obj.start)
  }, {
    id: 'numPassingTests',
    label: 'Status',
    format: (_, obj) => {
      const {numPassingTests, numFailingTests} = obj
      const total = obj.testResults.length

      if ( numPassingTests == total)
        return <PassChip count={numPassingTests} />
      else if (numFailingTests == total)
        return <FailChip count={numFailingTests} msg={obj.failureMessage}/>
      else return (
        <>
          <PassChip count={numPassingTests} />
          <FailChip count={numFailingTests} msg={obj.failureMessage}/>
        </>
      )
    }
  }
]

const subColumns = [
  {
    id: 'fullName',
    label: 'Name',
    format: (_, obj) => {
      return (
        <span className="muted">
          {obj.ancestorTitles[0]} > {obj.fullName}
        </span>
      )
    }
  }, {
    id: 'duration',
    label: 'Duration',
    format: val => msToTimeStr(val)
  }, {
    id: 'status',
    label: 'Status',
    format: val => {
      if (val == 'passed')
        return <CheckIcon className="success"/>
      else if (val == 'failed')
        return <WarningIcon className="failed"/>
      return <>??</>
    }
  }
]

const PassChip = ({count}) =>
  <Chip style={{color: '#fff', background: '#00b732'}}
    label={`${count} Passed`}
    size="small"
    icon={<CheckIcon style={{color: '#fff', fill: '#006502'}} />}
  />


const FailChip = ({count, msg}) =>
  <Chip style={{color: '#fff', background: '#ce0303'}}
    label={`${count} Failed`}
    size="small"
    icon={<WarningIcon style={{color: '#fff', fill: '#650000'}} />}
    onClick={() => {
      // open dialog when fail chips are clicked
      const event = new CustomEvent('onShowMsg', {detail: msg})
      document.dispatchEvent(event)
    }}
  />


const renderDateTime = (date) => {
  const d = new Date(date)
  const [_, mm, dd] = [d.getFullYear(), months[d.getMonth()], d.getDate()]

  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  return (
    <>
      <span style={{ fontWeight: 800}}>
        {time}
      </span>
      <span style={{margin: '5px 5px', fontSize: '1em'}}>
        {mm} {dd}
      </span>
    </>
  )
}


const useStyles = makeStyles(theme => ({
  root: {}
}));


export default function Tests() {
  const styles = useStyles();

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [date, setDate] = useState(null)

  const [msg, setMsg] = useState(null)

  // get log
  useEffect(() => {
    getEnd2EndLog().then(data => {
      setData(data)
      setDate(data.endTime)
      setLoading(false)
    })
  }, [])

  const onOpenDialog = useCallback(event => setMsg(event.detail))

  // custom event for opening error log
  useEffect(() => {
    window.addEventListener('onShowMsg', onOpenDialog, true)
    return () => {
      window.removeEventListener('onShowMsg', onOpenDialog, true)
    }
  }, [onOpenDialog])

  return (
    <div className={styles.root}>
      <Grid container>

        <Grid container item xs={12} direction="column">
          <Paper className="card">
            {loading && <Progress className="card-progress"/>}

            <Subtitle noUpper>
              Latest tests <small className="muted">| {date && renderDateTime(date)}</small>
            </Subtitle>

            {data &&
              <Table
                columns={columns}
                rows={data.testResults}
                expandable={subColumns}
                expandedRowsKey="testResults"
              />
            }
          </Paper>
        </Grid>
      </Grid>

      {msg &&
        <Dialog title={<><WarningIcon className="failed"/> Error Log</>}
          open={msg ? true : false}
          primaryBtnText="close"
          maxWidth="lg"
          content={<pre>{msg}</pre>}
          onClose={() => setMsg(false)}
          onPrimaryClick={() => setMsg(false)}
        />
      }

   </div>
  )
}

