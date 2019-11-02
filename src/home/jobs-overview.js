import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Subtitle from './subtitle';

import BarChart from '../charts/bar';
import ChartIcon from '@material-ui/icons/BarChartOutlined';
import TableIcon from '@material-ui/icons/TableChartOutlined';

import {getStats} from '../api/app-service';


const JobCounts = (props) => {
  const {data} = props
  return (
    <ul style={{listStyle: 'none', padding: 0}}>
      {
        data.map(obj => {
          const {value, label, id} = obj;
          return (
            <li key={obj.id}>
              <Link to={`/jobs/${id}`}>{label} ({value})</Link>
            </li>
          )
        })

      }
    </ul>
  )
}

export default function JobsOverview(props) {
  const {styles} = props;

  const [stats, setStats] = useState(null);
  const [isChart, setIsChart] = useState(false);

  const margin = {top: 30, right: 30, left: 30, bottom: 30}

  useEffect(() => {
    getStats()
      .then(stats => setStats(stats))

  }, [])

  return (
    <Paper className={styles.card} style={isChart ? {height: '400px'} : {}}>
      <Grid container justify="space-between">
        <Grid item>
          <Subtitle inline>
            My Jobs
          </Subtitle>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => setIsChart(!isChart)}
            size="small"
            disableRipple
          >
            {isChart && <TableIcon />}
            {!isChart && <ChartIcon />}

          </Button>
        </Grid>
      </Grid>

      {
        stats && isChart &&
        <BarChart data={stats} margin={margin} noXLabels={true} />
      }
      {
        stats && !isChart &&
        <JobCounts data={stats} />
      }
    </Paper>
  )
}