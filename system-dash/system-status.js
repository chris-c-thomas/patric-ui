import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import CheckIcon from '@material-ui/icons/CheckCircleRounded'
import WarningIcon from '@material-ui/icons/WarningRounded'

import BarChart from '../src/charts/bar';
import Calendar from '../src/charts/calendar';


import {getHealthSummary, getDailyHealth} from './api/log-fetcher';
import { Typography } from '@material-ui/core';
import {get} from 'axios';

import config from './live-test-config'


// last number of hours to show
const HOURS = 8


const useStyles = makeStyles(theme => ({
  card: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
  },
  vizCard: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
    height: 400
  },
  calCard: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
    height: 300
  }
}));


const formatData = (data, lastN = HOURS*60) => {
  data = data.map(obj => ({
    time: obj.time.split(' ')[1],
    dataTime: obj.time,
    status: obj.status,
    duration: obj.duration,
    value: obj.duration,
  })).slice(-lastN)
  return data;
}

const colorBy = (node) => (
  node.data.status == 'P' ? 'rgb(77, 165, 78)' : 'rgb(198, 69, 66)'
);


const tickValues = (statuses) => {
  if (statuses.length > 30)
    return statuses.map(obj => obj.time).reverse().filter((_,i) => i % 10 == 0)
  return statuses.map(obj => obj.time);
}

function LiveStatus(props) {
  const styles = useStyles()

  const {
    auth, dataAPI, ws, shock,
    appService, minHash, homology
  } = config;

  const [status, setStatus] = useState({});

  useEffect(() => {
    get(auth.url).then(res => {
      if (res.status !== 200) throw res;
      setStatus(obj => ({...obj, auth: true}))
    }).catch(e => {
      setStatus(obj => ({...status, auth: false}))
    })

    get(dataAPI.url).then(res => {
      if (res.status !== 200 && res.data.response.docs.length == 25 ) throw res;
      setStatus(obj => ({...obj, dataAPI: true}))
    }).catch(e => {
      setStatus(obj => ({...obj, dataAPI: false}))
    })

    get(ws.url).then(res => {
      if (res.status !== 200) throw res;
      setStatus(obj => ({...obj, ws: true}))
    }).catch(e => {
      setStatus(obj => ({...obj, ws: false}))
    })

    get(appService.url).then(res => {
      if (res.status !== 200) throw res;
      setStatus(obj => ({...obj, appService: true}))
    }).catch(e => {
      setStatus(obj => ({...obj, appService: false}))
    })

    get(shock.url).then(res => {
      if (res.status !== 200) throw res;
      setStatus(obj => ({...obj, shock: true}))
    }).catch(e => {
      setStatus(obj => ({...obj, shock: false}))
    })

    get(minHash.url).then(res => {
      if (res.status !== 200) throw res;
      setStatus(obj => ({...obj, minHash: true}))
    }).catch(e => {
      setStatus(obj => ({...obj, minHash: false}))
    })

    get(homology.url).then(res => {
      if (res.status !== 200) throw res;
      setStatus(obj => ({...obj, homology: true}))
    }).catch(e => {
      setStatus(obj => ({...obj, homology: false}))
    })
  }, [])

  return (
    <Paper className={styles.card}>
      <Typography variant="h6">Live Status</Typography>
        <table className="table simple">
          <thead>
            <tr>
              <th>Service</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(config).map(key => (
                <tr key={key}>
                  <td>{config[key].label}</td>
                  <td>
                    {!(key in status) && 'loading...' }
                    {key in status && status[key] && <CheckIcon className="success" />}
                    {key in status && !status[key] &&  <WarningIcon className="failed" />}
                  </td>
                </tr>
                )
              )
            }
          </tbody>
        </table>
    </Paper>
  )
}




export default function SystemStatus() {
  const styles = useStyles();

  const [statuses, setStatuses] = useState(null);
  const [dailyHealth, setDailyHealth] = useState(null);

  useEffect(() => {
    getHealthSummary().then(data => {
      setStatuses(formatData(data));
    })

    getDailyHealth().then(data => {
      setDailyHealth(data);
    })
  }, [])


  return (
    <div className={styles.root}>
      <Grid container>
        <Grid item xs={5}>
          <LiveStatus />
        </Grid>

        <Grid container item xs={12} direction="column">

          <Grid item>
            <Paper className={styles.vizCard}>
              {!statuses && <LinearProgress className="card-progress"/>}

              <Typography variant="h6">System Health (last {HOURS} hours)</Typography>
              {
                statuses &&
                <BarChart
                  data={statuses}
                  indexBy="time"
                  margin={{ top: 10, right: 10, bottom: 70, left: 40 }}
                  axisLeft={{
                    label: 'milliseconds'
                  }}
                  padding={.5}
                  colors={colorBy}
                  axisBottom={{
                    tickRotation: 40,
                    legendPosition: 'middle',
                    legendOffset: 50,
                    tickValues: tickValues(statuses)
                  }}
                />
              }
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={styles.calCard}>
              {dailyHealth && <Calendar data={dailyHealth} />}
            </Paper>
          </Grid>

        </Grid>

      </Grid>
   </div>
  )
}

