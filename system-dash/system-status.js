import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import BarChart from '../src/charts/bar';
import Calendar from '../src/charts/calendar';

import {getHealthSummary} from './api/log-fetcher';
import { Typography } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {

  },
  card: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
    height: 500
  }
}));


const formatData = (data) => {
  data = data.map(obj => ({
    time: obj.time.split(' ')[1],
    dataTime: obj.time,
    status: obj.status,
    duration: obj.duration,
    value: obj.duration,
  }))
  console.log('data', data)
  return data;
}



const colorBy = (node) => (node.data.status == 'P' ? 'rgb(77, 165, 78)' : 'rgb(198, 69, 66)');


export default function SystemStatus() {
  const styles = useStyles();

  const [days, setDays] = useState(null);
  const [statuses, setStatuses] = useState(null);

  useEffect(() => {
    getHealthSummary().then(data => {
      setStatuses(formatData(data));
    })
  }, [])

  return (
    <div className={styles.root}>
      <Grid container>
        <Grid container item xs={12} direction="column">
          <Grid item>
            <Paper className={styles.card}>
              <Typography variant="h6">Last 24 hours</Typography>
              {
                statuses &&
                <BarChart
                  data={statuses}
                  indexBy="time"
                  margin={{ top: 50, right: 0, bottom: 100, left: 30 }}
                  axisLeft={{
                    label: 'milliseconds'
                  }}
                  colors={colorBy}
                  axisBottom={{
                    tickRotation: 40,
                    legendPosition: 'middle',
                    legendOffset: 50,
                    tickValues: (statuses.map(obj => obj.time)).reverse().filter((_,i) => i % 5 == 0)
                  }}
                />
              }
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={styles.card}>
              {days && <Calendar data={days} />}
            </Paper>
          </Grid>

        </Grid>

      </Grid>
   </div>
  )
}

