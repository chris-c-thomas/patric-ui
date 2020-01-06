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

import BarChart from '../src/charts/bar';
import Calendar from '../src/charts/calendar';

import { getHealthReport, getCalendar, getIndexerHistory } from './api/log-fetcher';
import { Typography } from '@material-ui/core';

import { LiveStatusProvider, LiveStatusContext } from './live-status-context';

import ErrorMsg from '../src/error-msg';
import Subtitle from '../src/home/subtitle';
import FilterChips from '../src/utils/ui/chip-filters';
import {months} from '../src/utils/dates';

import config from './config'

// number of hours into the past to show
const HOURS = 3

// number of minutes to show as most recent
const MOST_RECENT = 10

const useStyles = makeStyles(theme => ({
  card: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
  },
  shortHistoryCard: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
    height: 290
  },
  vizCard: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
    minHeight: 375
  },
  calCard: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(4, 2),
    height: 300
  },
  dateFilter: {
    marginLeft: theme.spacing(1)
  },
  loadingIndicator: {
    position: "absolute",
    right: 3,
    top: 2
  }
}));


const tickValues = (statuses) => {
  if (statuses.length > 30)
    return statuses.map(obj => obj.humanTime).reverse().filter((_,i) => i % 10 == 0)
  return statuses.map(obj => obj.humanTime);
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
            <a>
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
  const styles = useStyles()

  const [time, setTime] = useState(null)

  return (
    <Paper className={styles.card}>
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
            <LiveRows afterUpdate={(time) => setTime(time)}/>
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

const SystemHealth = (props) => {
  const {data} = props;
  const opts = props.customBar ? {barComponent: BarComponent} : {}

  return (
    <BarChart
      data={data}
      indexBy="humanTime"
      margin={{ top: 10, right: 20, bottom: 80, left: 40 }}
      axisLeft={{
        label: 'milliseconds'
      }}
      padding={.5}
      colors={colorBy}
      axisBottom={{
        tickRotation: 40,
        legendPosition: 'middle',
        legendOffset: 50,
        tickValues: tickValues(data)
      }}
      {...props}
      {...opts}
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

const formatRecentData = (data) => {
  return formatData(data, MOST_RECENT)
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
      <span item style={{ fontWeight: 800}}>
        {start} - {end}
      </span>
      <span item style={{margin: '5px 5px', fontSize: '1em'}}>
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
  const [error, setError] = useState(null);

  // currently selected service and day state
  const [service, setService] = useState('All');
  const [date, setDate] = useState();

  // and index for the amount into the past
  const [idx, setIdx] = useState(0)
  //const useDebouncedIdx = useDebounce(idx, 300)


  // fetch genome indexer history
  useEffect(() => {
    getIndexerHistory().then(data => {
      const nonZero = data.filter(o => o)
      setIndexerHist(formatData(data))
    })
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
    getCalendar().then(data => setCalendar(data))
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
      setError(e);
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

  const historyMax = () => {
    return Math.max(...fullHistory.map(o => o.value))
  }

  const onBarClick = (node) => {
    console.log(node)
  }

  return (
    <div className={styles.root}>
      <Grid container>
        <Grid container>
          <Grid item xs={5}>
            <LiveStatus />
          </Grid>

          <Grid item xs={7}>
            <Paper className={styles.shortHistoryCard}>
              <Subtitle>Genome Indexer</Subtitle>
              {indexerHist && <SystemHealth data={indexerHist} customBar />}
              { error && <ErrorMsg error={error} noContact /> }
            </Paper>
          </Grid>
        </Grid>

        <Grid container item xs={12} direction="column">
          <Grid item>
            <Paper className={styles.vizCard}>
              {loading && <LinearProgress className="card-progress"/>}

              {!error &&
                <>
                  <Grid container direction="row" justify="space-between">
                    <Grid item>
                      <Subtitle inline>
                        System Health
                        {
                          date &&
                          <Chip
                            label={date}
                            onDelete={() => setDate(null)}
                            color="primary"
                            className={styles.dateFilter}
                          />

                        }
                      </Subtitle>
                      {renderInterval(interval)}
                    </Grid>

                    <Grid item>
                      <FilterChips
                        items={getFilters()}
                        filterState={service}
                        onClick={(type) => setService(type)}
                      />
                    </Grid>
                  </Grid>


                  { history && <SystemHealth data={history} maxValue={historyMax()} onClick={onBarClick} /> }

                  <div>
                    <Slider
                      value={idx}
                      getAriaValueText={(date) => date}
                      aria-labelledby="discrete-slider"
                      onChange={(evt, idx) => setIdx(idx)}
                      min={-24*60 - 3*60}
                      max={0}
                      valueLabelDisplay="auto"
                      ValueLabelComponent={SliderLabelComponent}
                      valueLabelFormat={() => `${interval[0]} - ${interval[1]}`}
                    />
                  </div>
                </>
              }

              { error && <ErrorMsg error={error} noContact /> }

            </Paper>
          </Grid>

          <Grid item>
            <Paper className={styles.calCard}>
              <Subtitle>Calendar</Subtitle>
              { error && <ErrorMsg error={error} noContact /> }
              { calendar && <Calendar data={calendar} onClick={handleDayClick} from="2020-1-1" /> }
            </Paper>
          </Grid>
        </Grid>

      </Grid>
   </div>
  )
}

