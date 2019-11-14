import React, {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import CheckIcon from '@material-ui/icons/CheckCircleRounded'
import WarningIcon from '@material-ui/icons/WarningRounded'

import BarChart from '../src/charts/bar';
import Calendar from '../src/charts/calendar';

import {getHealthReport, getDailyHealth, filterByService} from './api/log-fetcher';
import { Typography } from '@material-ui/core';

import { LiveStatusProvider, LiveStatusContext } from './live-status-context'

import Subtitle from '../src/home/subtitle';
import FilterChips from '../src/utils/ui/chip-filters'

import config from './config'

// number of hours into the past to show
const HOURS = 8

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
    height: 350
  },
  calCard: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
    height: 200
  }
}));


const tickValues = (statuses) => {
  if (statuses.length > 30)
    return statuses.map(obj => obj.time).reverse().filter((_,i) => i % 10 == 0)
  return statuses.map(obj => obj.time);
}

const LiveRows = (props) => {
  const [state, time] = useContext(LiveStatusContext);

  useEffect(() => {
    props.afterUpdate(time)
  }, [time])

  return (
    <>
      {Object.keys(config).map(key => (
        <tr key={key}>
          <td>
            <a>
              {config[key].label}
            </a>
          </td>
          <td>
            {!(key in state) && 'loading...' }
            {key in state && state[key] && <CheckIcon className="success" />}
            {key in state && !state[key] &&  <WarningIcon className="failed" />}
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


const StatusHistory = (props) => {
  const {data} = props;

  return (
    <BarChart
      data={data}
      indexBy="time"
      margin={{ top: 10, right: 20, bottom: 70, left: 40 }}
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
    />
  )
}


const formatData = (data, lastN = HOURS*60) => {
  data = data.map(obj => ({
    time: obj.time.split(' ')[1].slice(0, -3),
    status: obj.status,
    duration: obj.duration,
    value: obj.duration,
  })).slice(-lastN)
  return data;
}

const formatRecentData = (data) => {
  return formatData(data, MOST_RECENT)
}

export default function SystemStatus() {
  const styles = useStyles();

  const [recentHistory, setRecentHistory] = useState(null);
  const [history, setHistory] = useState(null);
  const [dailyHealth, setDailyHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const [service, setService] = useState('All');

  useEffect(() => {
    const filter = service != 'All' && service

    setLoading(true)
    getHealthReport(filter).then(data => {
      setRecentHistory(formatRecentData(data))
      setHistory(formatData(data))
      setLoading(false)
    })
  }, [service])

  useEffect(() => {
    getDailyHealth().then(data => {
      setDailyHealth(data);
    })
  }, [])

  const onFilter = (service) => {
    const data = filterByService(data, service)
    console.log('filtered data', data)
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
              <Subtitle>Last {MOST_RECENT} minutes</Subtitle>
              {recentHistory && <StatusHistory data={recentHistory} />}
            </Paper>
          </Grid>

        </Grid>


        <Grid container item xs={12} direction="column">
          <Grid item>
            <Paper className={styles.vizCard}>
              {loading && <LinearProgress className="card-progress"/>}

              <Subtitle inline>System Health (last {HOURS} hours)</Subtitle>
              <FilterChips
                items={getFilters()}
                filterState={service}
                onClick={(type) => setService(type)}
              />

              { history && <StatusHistory data={history} /> }
            </Paper>
          </Grid>

          <Grid item>
            <Paper className={styles.calCard}>
              <Subtitle>History</Subtitle>
              {dailyHealth && <Calendar data={dailyHealth} />}
            </Paper>
          </Grid>

        </Grid>

      </Grid>
   </div>
  )
}

