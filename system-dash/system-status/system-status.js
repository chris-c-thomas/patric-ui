import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckIcon from '@material-ui/icons/CheckCircleRounded'
import WarningIcon from '@material-ui/icons/WarningRounded'
import Dialog from '../../src/dialogs/basic-dialog'
import ReBrushChart from '../../src/charts/re-brush-chart'
import CalendarHeatmap from 'react-calendar-heatmap'

import { getHealthReport, getCalendar, getIndexerData, getErrorLog } from '../api/log-fetcher'
import { Typography, StepConnector } from '@material-ui/core'
import { LiveStatusProvider, LiveStatusContext } from '../live-status-context'
import ErrorMsg from '../../src/error-msg'
import Subtitle from '../../src/home/subtitle'
import FilterChips from '../../src/utils/ui/chip-filters'
import config from '../config'
import { timeToHumanTime } from '../../src/utils/units'

import 'react-calendar-heatmap/dist/styles.css'
import './calendar.scss'


const HOURS = 24 // number of hours into the past to show

const useStyles = makeStyles(theme => ({
  root: {
  },
  dateFilter: {
    marginRight: theme.spacing(1)
  },
  loadingIndicator: {
    position: "absolute",
    right: 3,
    top: 2
  }
}));


const loadingStyle = {
  position: "absolute",
  right: 3,
  top: 2
}

const LiveRows = (props) => {
  const [state, time] = useContext(LiveStatusContext);

  useEffect(() => {
    props.afterUpdate(time)
  }, [time, state])

  return (
    <>
      {Object.keys(config).map(key => (
        <tr key={key}>
          <td width="100%">
            <a onClick={() => props.onClick(config[key].label)}>
              {config[key].label}
            </a>
          </td>
          <td align="right" style={{position: 'relative'}}>
            {key in state && state[key] && <CheckIcon className="success" />}
            {key in state && !state[key] &&  <WarningIcon className="failed" />}

            {/* also indicate thereafter */}
            {
              (key in state && state[key] == 'loading') &&
              <span style={loadingStyle}>
                <CircularProgress size={28} />
              </span>
            }
          </td>
        </tr>
        )
      )}
    </>
  )

}

const LiveStatus = (props) => {
  const [time, setTime] = useState(null)

  return (
    <Paper className="card">
      {!time && <LinearProgress className="card-progress"/>}
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h6">
            Live Status {time && <small className="muted">| as of {time}</small>}
          </Typography>
        </Grid>
      </Grid>

      <table className="simple dense">
        <thead>
          <tr>
            <th>Service</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <LiveStatusProvider>
            <LiveRows
              afterUpdate={(time) => setTime(time)}
              onClick={type => props.onClick(type)}
            />
          </LiveStatusProvider>
        </tbody>
      </table>
    </Paper>
  )
}

const getFilters = () => {
  return [
    {type: 'All'},
    ...Object.keys(config).map(key => ({...config[key], type: config[key].label}) )
  ]
}


const BrushChart = ({data, ...props}) =>
  <ReBrushChart data={data}
    brushColor="#2e75a3"
    dataKey="value"
    xDataKey="humanTime"
    xTick={{fontSize: '.8em'}}
    yTick={{fontSize: '.8em'}}
    margin={{top: 20, right: 0, left: -15, bottom: 0}}
    {...props}
  />


const Calendar = ({data, onClick}) => {

  // const [tt, setTT] = useState(null)

  return (
    <>
      <CalendarHeatmap
        startDate={new Date(data[0].day)}
        endDate={new Date('2020-12-31')} // data[data.length - 1].day
        showWeekdayLabels={true}
        weekdayLabels={['Sun', 'M', 'Tues', 'W', 'Thurs', 'F', 'Sat']}
        values={data}
        onClick={onClick}
        titleForValue={(obj) => obj ?
          `${obj.day}\n\n${obj.failed} failed\n${obj.passed} passed\n${obj.percent}% failure rate`
          : ''
        }
        //onMouseOver={(evt, data) => {
        //  if (!data) {
        //    setTT(null)
        //    return
        //  }
        //}}
        classForValue={(obj) => {
          if (!obj) return 'color-empty'

          const {failed} = obj;
          if (failed <= 0)
            return `success-3`;
          else if (failed <= 5)
            return `success-2`;
          else if (failed <= 10)
            return `success-1`;
          else if (failed <= 50)
            return `fail-1`
          else if (failed <= 100)
          return `fail-2`;
          else if (failed <= 200)
            return `fail-3`;
          else if (failed > 200)
            return `fail-4`;
        }}
      />
    </>
  )
}
/*
const Tooltip = styled.div`
  visibility: hidden;
  position: absolute;
  background-color: #333;
  width: 100px;
  height: 100px;
  z-index: 1000
`*/

const colorBy = (obj) =>
   obj.status == 'P' ? 'rgb(77, 165, 78)' : 'rgb(198, 69, 66)'


const formatData = (data, lastN = HOURS*60) => {
  data = data.map(obj => ({
    humanTime: timeToHumanTime(obj.time), // remove secs
    value: obj.duration,
    ...obj
  })).slice(-lastN)
  return data;
}




export default function SystemStatus() {
  const styles = useStyles();

  // genome indexer history data
  const [indexerData, setIndexerData] = useState(null);

  // system health history data
  const [healthData, setHealthData] = useState(null);

  // system health calendar overview
  const [calData, setCalData] = useState(null);

  // the usual loading and error state
  const [loading, setLoading] = useState(false);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);
  const [error3, setError3] = useState(null);

  // currently selected service and day state
  const [service, setService] = useState('All');
  const [date, setDate] = useState();

  // state for displaying error log
  const [errorLog, setErrorLog] = useState(null)


  // fetch genome indexer history
  useEffect(() => {
    getIndexerData().then(data => {
      setIndexerData(formatData(data))
    }).catch(e => setError1(e))
  }, [])


  // fetch health logs whenever service and dates change
  useEffect(() => {
    fetchLog()
  }, [service, date])


  // fetch calendar
  useEffect(() => {
    getCalendar()
      .then(data => setCalData(data))
      .catch(e => setError3(e))
  }, [])


  const fetchLog = () => {
    const serviceFilter = service != 'All' && service

    setLoading(true)
    getHealthReport({service: serviceFilter, date}).then(data => {
      setHealthData(formatData(data, 0))
      setLoading(false)
    }).catch(e => {
      setError2(e);
      setLoading(false);
    })
  }

  const getMax = (data) => Math.max(...data.map(o => o.value))

  const onDayClick = (evt) => {
    // there may not be data for that date
    if (!evt) return;

    const {day} = evt;

    const d = new Date(day)
    const [yyyy, mm, dd] = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)]
    const str = `${yyyy}-${mm}-${dd}`
    setDate(str);
  }

  const onNodeClick = (data) => {
    if (!data) return;
    const {status, time} = data.activePayload[0].payload

    // ignore anything that isn't failed status
    if (status != 'F') return;

    getErrorLog(time).then(data => {
      setErrorLog(data)
    })
  }

  return (
    <div className={styles.root}>
      <Grid container>
        <Grid container>
          <Grid item xs={4}>
            <LiveStatus onClick={type => setService(type)} />
          </Grid>

          <Grid item xs={8}>
          <Paper className="card" style={{height: 290}}>
              <Subtitle noUpper>Genome Indexer</Subtitle>
              {
                indexerData &&
                <BrushChart data={indexerData}
                  color={'rgb(77, 165, 78)'}
                  units=" genome(s)"
                />
              }
              { error1 && <ErrorMsg error={error1} noContact /> }
            </Paper>
          </Grid>
        </Grid>


        <Grid container item xs={12} direction="column">
          <Grid item>
            <Paper className="card" style={{height: 370}}>
              {loading && <LinearProgress className="card-progress"/>}

              {!error2 &&
                <>
                  <Grid container direction="row" justify="space-between">
                    <Grid item>
                      <Subtitle inline noUpper>
                        System Health
                      </Subtitle>
                    </Grid>

                    <Grid item>
                      {
                        date &&
                        <Chip
                          label={date}
                          onDelete={() => setDate(null)}
                          color="primary"
                          className={styles.dateFilter}
                        />
                      }
                      <FilterChips
                        items={getFilters()}
                        filterState={service}
                        onClick={type => setService(type)}
                      />
                    </Grid>
                  </Grid>

                  {
                    healthData &&
                    <BrushChart data={healthData}
                      yMax={getMax(healthData)}
                      onClick={onNodeClick}
                      colorBy={colorBy}
                      units="ms"
                    />
                  }
                </>
              }

              { error2 && <ErrorMsg error={error2} noContact /> }
            </Paper>
          </Grid>
        </Grid>


        <Grid container>
          <Grid item xs={12}>
            <Paper className="card" style={{height: 200}}>
              <Subtitle noUpper>Calendar</Subtitle>
              { error3 && <ErrorMsg error={error3} noContact /> }
              {
                calData &&
                <Calendar data={calData} onClick={onDayClick}/>
              }
            </Paper>
          </Grid>

          {/*
          <Grid item xs={3}>
            <Paper className="card" style={{height: 200}}>
              <Subtitle noUpper>Stats</Subtitle>

            </Paper>
          </Grid>

          <Grid item xs={5}>
            <Paper className="card" style={{height: 200}}>
              <Subtitle noUpper>Histogram</Subtitle>

            </Paper>
          </Grid>
          */}
        </Grid>

      </Grid>

      {errorLog &&
        <Dialog title={<><WarningIcon className="failed"/> Error Log (time is in UTC)</>}
          open={errorLog ? true : false}
          primaryBtnText="close"
          maxWidth="lg"
          content={<pre>{errorLog}</pre>}
          onClose={() => setErrorLog(false)}
          onPrimaryClick={() => setErrorLog(false)}
        />
      }
   </div>
  )
}

