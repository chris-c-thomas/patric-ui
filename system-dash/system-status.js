import React, {useState, useEffect, useContext, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/CheckCircleRounded'
import WarningIcon from '@material-ui/icons/WarningRounded'

import Dialog from '../src/dialogs/basic-dialog';
import BarChart from '../src/charts/bar';
import Calendar from '../src/charts/calendar';
import { getHealthReport, getCalendar, getIndexerHistory, getErrorLog } from './api/log-fetcher';
import { Typography } from '@material-ui/core';
import { LiveStatusProvider, LiveStatusContext } from './live-status-context';
import ErrorMsg from '../src/error-msg';
import Subtitle from '../src/home/subtitle';
import FilterChips from '../src/utils/ui/chip-filters';
import {months} from '../src/utils/dates';

import config from './config'


const HOURS = 3 // number of hours into the past to show


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


const tickValues = (data, key) => {
  if (data.length > 30)
    return data.map(obj => obj[key]).reverse().filter((_,i) => i % 10 == 0)
  return data.map(obj => obj[key]);
}


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


const colorBy = (node) => (
  node.data.status == 'P' ? 'rgb(77, 165, 78)' : 'rgb(198, 69, 66)'
);

const Chart = ({data, margin, ...props}) => {

  return (
    <BarChart
      data={data}
      indexBy="humanTime"
      margin={{top: 10, right: 20, bottom: 80, left: 40, ...margin}}
      axisLeft={{
        label: 'milliseconds'
      }}
      padding={.5}
      colors={colorBy}
      axisBottom={{
        tickRotation: 40,
        legendPosition: 'middle',
        legendOffset: 50,
        tickValues: tickValues(data, 'humanTime')
      }}
      {...props}
    />
  )
}


const formatData = (data, lastN = HOURS*60) => {
  data = data.map(obj => ({
    humanTime: new Date(obj.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }), // remove secs
    value: obj.duration,
    ...obj
  })).slice(-lastN)
  return data;
}


const SliderLabelComponent = (props) => {
  const { children, open, value } = props;

  const popperRef = useRef(null);
  useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef,
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={value}
    >
      {children}
    </Tooltip>
  );
}


const renderInterval = (interval) => {
  if (!interval[0]) return (<></>)

  const d = new Date(interval[1])
  const [_, mm, dd] = [d.getFullYear(), months[d.getMonth()], d.getDate()]

  const start = new Date(interval[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const end = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  return (
    <div>
      <span style={{ fontWeight: 800}}>
        {start} - {end}
      </span>
      <span style={{margin: '5px 5px', fontSize: '1em'}}>
        {mm} {dd}
      </span>
    </div>
  )
}


export default function SystemStatus() {
  const styles = useStyles();

  // genome indexer history data
  const [indexerHist, setIndexerHist] = useState(null);

  // system health history data
  const [fullHistory, setFullHistory] = useState(null);
  const [history, setHistory] = useState(null);
  const [interval, setInterval] = useState([null, null]);

  // system health calendar overview
  const [calendar, setCalendar] = useState(null);

  // the usual loading and error state
  const [loading, setLoading] = useState(false);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);
  const [error3, setError3] = useState(null);

  // currently selected service and day state
  const [service, setService] = useState('All');
  const [date, setDate] = useState();

  // and index for the amount into the past
  const [idx, setIdx] = useState(0)

  // state for displaying error log
  const [errorLog, setErrorLog] = useState(null)


  // fetch genome indexer history
  useEffect(() => {
    getIndexerHistory().then(data => {
      const nonZero = data.filter(o => o)
      setIndexerHist(formatData(data))
    }).catch(e => setError1(e))
  }, [])

  // fetch health logs whenever service and dates change
  useEffect(() => {
    fetchLog()
  }, [service, date])


  // update history when slider state is changed
  useEffect(() => {
    if(!history) return;

    // note: idx is non-positve, e.g., in [-24*60 + 3*60, 0]
    const end = fullHistory.length + idx
    const start = end - 3*60
    const newHistory = fullHistory.slice(start, end)
    setHistory(newHistory)

    // also keep track of time interval
    const sTime = (fullHistory[start] || {}).time
    const eTime = (fullHistory[end] || {}).time
    if (sTime && eTime) setInterval([sTime, eTime])

  }, [idx])

  // fetch calendar
  useEffect(() => {
    getCalendar()
      .then(data => setCalendar(data))
      .catch(e => setError3())
  }, [])


  const fetchLog = () => {
    const serviceFilter = service != 'All' && service

    setLoading(true)
    getHealthReport({service: serviceFilter, date}).then(data => {
      setFullHistory(formatData(data, 0))

      const d = formatData(data)
      setHistory(d)
      setInterval([d[0].time, d[d.length - 1].time])

      setLoading(false)
    }).catch(e => {
      setError2(e);
      setLoading(false);
    })
  }


  const handleDayClick = (evt) => {
    const {date, data} = evt;

    // there may not be data for that date
    if (!data) return;

    const d = new Date(date)
    const [yyyy, mm, dd] = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)]
    const str = `${yyyy}-${mm}-${dd}`
    setDate(str);
  }


  const historyMax = () => Math.max(...fullHistory.map(o => o.value))


  const onNodeClick = (node) => {
    const {status, time} = node.data

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
              { indexerHist && <Chart data={indexerHist} colors={['rgb(77, 165, 78)']} /> }
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
                      {renderInterval(interval)}
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
                    history &&
                    <Chart data={history}
                      maxValue={historyMax()}
                      onClick={onNodeClick}
                      margin={{bottom: 90, top: 50}}
                    />
                  }

                  <div>
                    <Slider
                      value={idx}
                      getAriaValueText={(date) => date}
                      aria-labelledby="discrete-slider"
                      onChange={(evt, i) => setIdx(i)}
                      min={-24*60 - 3*60}
                      max={0}
                      // valueLabelDisplay="auto"
                      // ValueLabelComponent={SliderLabelComponent}
                      // valueLabelFormat={() => humanInterval(interval)}
                    />
                  </div>
                </>
              }

              { error2 && <ErrorMsg error={error2} noContact /> }

            </Paper>
          </Grid>

          <Grid item>
            <Paper className="card" style={{height: 370}}>
              <Subtitle noUpper>Calendar</Subtitle>
              { error3 && <ErrorMsg error={error3} noContact /> }
              {
                calendar &&
                <Calendar data={calendar}
                  onClick={handleDayClick}
                  colors={['#c2e7c3', '#ffa2a2', '#ff4d4d']}
                  from="2020-01-02T00:00:00.000Z"
                />
              }
            </Paper>
          </Grid>
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

