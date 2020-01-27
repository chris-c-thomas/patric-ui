import React, {useState, useEffect, useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Progress from '@material-ui/core/LinearProgress';
import CheckIcon from '@material-ui/icons/CheckCircleRounded'
import WarningIcon from '@material-ui/icons/WarningRounded'
import IconButton from '@material-ui/core/IconButton'

import BarChart from '../../src/charts/bar';
import Table from '../../src/grids/mui-table'
import Selector from '../../src/apps/components/selector';
import { getUIPerfLog } from '../api/log-fetcher'
import { msToTimeStr, timeToHumanTime } from '../../src/utils/units';
import Subtitle from '../../src/home/subtitle';
import Dialog from '../../src/dialogs/basic-dialog';
import ErrorMsg from '../../src/error-msg';

import HumanTime from '../utils/components/human-time';

const columns = [
  {
    id: 'ancestorTitles',
    label: 'Test',
    format: vals => vals[0],
  }, {
    id: 'duration',
    label: 'Duration',
    format: val => msToTimeStr(val)
  }, {
    id: 'status',
    label: 'Status',
    format: (val, obj) => {
      if (val == 'passed')
        return <CheckIcon className="success"/>
      else if (val == 'failed')
        return <FailIcon msg={obj.suiteFailedMsg} />
      return <>??</>
    }
  }
]


const FailIcon = (props) => {
  const failMsg = props.msg
  const [msg, setMsg] = useState(null);

  return (
    <>
      <IconButton onClick={() => setMsg(failMsg)} aria-label="open error dialog" size="small">
        <WarningIcon className="failed"/>
      </IconButton>
      {
        open &&
        <Dialog title={<><WarningIcon className="failed"/> Error Log</>}
          open={msg ? true : false}
          primaryBtnText="close"
          maxWidth="lg"
          content={<pre>{msg}</pre>}
          onClose={() => setMsg(false)}
          onPrimaryClick={() => setMsg(false)}
        />
      }
    </>
  )
}

// takes test results, returns total "passed"/"failed" times
// for each set of tests
const getPerfMetrics = (data) => {
  const perfMetrics = []
  for (const tests of data) {
    const {startTime} = tests
    const testResults = tests.testResults[0].testResults;

    let passedTime = 0,
      failedTime = 0,
      totalTime = 0
    for (const test of testResults) {
      const {status} = test;
      if (status == 'passed') passedTime += test.duration;
      else if (status == 'failed') failedTime += test.duration;
      totalTime += test.duration;
    }

    perfMetrics.push({
      passedTime,
      failedTime,
      totalTime,
      startTime
    })
  }

  return perfMetrics
}


const Chart = ({data, margin, ...props}) => {
  const [curData, setCurData] = useState(data)
  const [view, setView] = useState('counts')
  const [keys, setKeys] = useState(['numPassedTests', 'numFailedTests'])


  useEffect(() => {
    if (view == 'counts')
      setCurData(data)
    else {
      setCurData(() => getPerfMetrics(data))
    }

    if (view == 'counts')
      setKeys(['numPassedTests', 'numFailedTests'])
    else if (view == 'total')
      setKeys(['totalTime'])
    else if (view == 'duration')
      setKeys(['passedTime', 'failedTime'])

  }, [view])


  return (
    <>
      <div className="pull-right">
        <Selector label="view"
          value={view}
          options={[
            {label: 'By status count', value: 'counts'},
            {label: 'By total time', value: 'total'},
            {label: 'By status duration', value: 'duration'}
          ]}
          onChange={v => setView(v)}
          className="pull-right"
        />
      </div>

      <BarChart
        data={curData}
        keys={keys}
        indexBy="startTime"
        margin={{top: 10, right: 20, bottom: 80, left: 40, ...margin}}
        axisLeft={{
          label: 'milliseconds'
        }}
        padding={.5}
        colors={['rgb(77, 165, 78)', 'rgb(198, 69, 66)']}
        axisBottom={{
          tickRotation: 40,
          legendPosition: 'middle',
          legendOffset: 50,
          //tickValues: tickValues(data, 'humanTime')
        }}
        axisBottom={{
          format: v => timeToHumanTime(v)
        }}
        {...props}
      />
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
  const [error, setError] = useState(null)

  // index for currently viewed test results
  const [idx, setIdx] = useState(null)

  const [testResults, setTestResults] = useState(null)
  const [date, setDate] = useState(null)


  // get log
  useEffect(() => {
    getUIPerfLog().then(data => {
      // set all data
      setData(data)
      setIdx(data.length - 1)
      setLoading(false)
    }).catch(e => setError(e))
  }, [])

  // when idx changes update the current data and date
  useEffect(() => {
    if (!idx) return;

    // separate state is used for currently viewed test results
    // we store the full (suite) failure message in this state
    const curData = data[idx]
    const tests = curData.testResults[0]

    const suiteFailedMsg = tests.failureMessage
    const testResults = tests.testResults.map(test => ({...test, suiteFailedMsg}))

    setTestResults(testResults)
    setDate(curData.startTime)
  }, [idx])

  // when clicking a bar, update idx
  const onNodeClick = (node) => {
    setIdx(() => node.index)
  }

  return (
    <div className={styles.root}>
      <Grid container>

        <Grid container item xs={12} direction="column">

          <Paper className="card" style={{height: 300}}>
            <Subtitle inline noUpper>Performance History</Subtitle>
            { data &&
              <Chart data={data}
                onClick={onNodeClick}
                margin={{bottom: 90, top: 50}}
              />
            }
          </Paper>

          <Paper className="card">
            {loading && <Progress className="card-progress"/>}

            <Subtitle noUpper>
              Latest runs
              <small className="muted"> | {date && <HumanTime date={date}/>}</small>
            </Subtitle>

            { error && <ErrorMsg error={error} noContact /> }

            {testResults &&
              <Table
                columns={columns}
                rows={testResults}
                //expandable={subColumns}
                //expandedRowsKey="testResults"
              />
            }
          </Paper>
        </Grid>
      </Grid>
   </div>
  )
}
