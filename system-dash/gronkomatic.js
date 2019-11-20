import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import raceData from './race.json'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider'

import Subtitle from '../src/home/subtitle';

import { Paper } from '@material-ui/core';
import { Bar } from '@nivo/bar'

const useStyles = makeStyles(theme => ({
  root: {

  },
  card: {
    position: 'relative',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(2, 2),
    height: 900
  },
  slider: {
    width: 300
  }
}));


const BarComponent = props => {
  return (
    <g transform={`translate(${props.x},${props.y})`}>
      <rect x={-3} y={7} width={props.width} height={props.height} fill="rgba(0, 0, 0, .07)" />
      <rect width={props.width} height={props.height} fill={props.color} />
      <rect x={props.width - 5} width={5} height={props.height} fill={props.borderColor} fillOpacity={0.2} />
      <text
        x={props.width + 5}
        y={props.height / 2 - 8}
        textAnchor="start"
        dominantBaseline="central"
        fill="black"
        style={{
          fontWeight: 900,
          fontSize: 15,
        }}
      >
        {props.data.indexValue}
      </text>
      <text
        x={props.width + 5}
        y={props.height / 2 + 10}
        textAnchor="start"
        dominantBaseline="central"
        fill={props.borderColor}
        style={{
          fontWeight: 400,
          fontSize: 13,
        }}
      >
        {props.data.value}
      </text>
    </g>
  );
};


const getDayData = (data) => {

  let dayData = Object.keys(data).filter(k => k != 'date').map(k => {
    return {
      name: k,
      value: data[k]
    }
  })

  return dayData.sort((a,b) => a.value - b.value).slice(-15)
}

const months = [
  'January', 'February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const renderDay = (date) => {
  const d = new Date(date);
  const [yyyy, mm, dd] = [d.getFullYear(), months[d.getMonth()], d.getDate()]

  return (
    <div className="flex">
      <span style={{fontSize: '3.0em', fontWeight: 800}} className="column">{yyyy}</span>
      <span style={{fontSize: '1.2em', margin: '5px 5px'}} className="column">
        <span>{mm}</span><br/>
        <span>{dd}</span>
      </span>
    </div>


  )
}


const Chart = (props) => {
  const {data} = props;
  return (
    <Bar
      width={800}
      height={800}
      layout="horizontal"
      margin={{ top: 50, right: 120, bottom: 80, left: 20 }}
      data={data}
      indexBy="name"
      keys={['value']}
      colors={{ scheme: 'spectral' }}
      colorBy="indexValue"
      borderColor={{ from: 'color', modifiers: [['darker', 2.6]] }}
      enableGridX
      enableGridY={false}
      axisTop={{
        format: '~s',
      }}
      axisBottom={{
        format: '~s',
      }}
      axisLeft={null}
      padding={0.3}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
      isInteractive={false}
      barComponent={BarComponent}
      motionStiffness={170}
      motionDamping={26}
    />
  )
}


export default function Insights() {
  const styles = useStyles();

  const lastIdx = raceData.length - 1;

  const [current, setCurrent] = useState(lastIdx);
  const [data, setData] = useState(null);

  const [date, setDate] = useState(raceData[lastIdx].date);
  const [field, setField] = useState('isolation_country');

  const [start, setStart] = useState(false);
  const [reset, setReset] = useState(false);


  useEffect(() => {
    setData( getDayData(raceData[current]) )

    if (!start) return;

    const timer = setTimeout(() => {
      const next = current + 1

      if (next >= raceData.length) {
        clearTimeout(timer);
        return;
      }

      setCurrent(next);

      const day = raceData[next].date
      setDate(day)
    }, 20);

    return () => clearTimeout(timer);
  }, [current, start])



  const startSimulation = () => {
    if (!start) {
      setCurrent(0)
      setStart(true)
    } else if (start) {
      setStart(false)
    }
  }

  return (
    <div className={styles.root}>
      <Grid container>

        <Grid container item xs={8} direction="column">

          <Paper className={styles.card}>

            <Grid container justify="space-between">
              <Grid item>
                <Subtitle inline>
                  Historical View <small className="muted"> | genomes by {field.replace('_', ' ')}</small>
                </Subtitle>
              </Grid>
              <Grid>

              </Grid>
            </Grid>


            <Grid container direction="column">
              <Grid item>
                {date && renderDay(date)}
              </Grid>

              <Grid item>
                <Slider
                  className={styles.slider}
                  defaultValue={current}
                  getAriaValueText={() => date}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  onChange={(evt, idx) => setCurrent(idx)}
                  min={0}
                  max={lastIdx}
                />
              </Grid>

              <Grid item>
                <Button variant="contained" color="primary" onClick={startSimulation} disableRipple>
                  {start ? 'Stop' : 'Play'}
                </Button>
              </Grid>
            </Grid>

            {data && <Chart data={data} /> }
          </Paper>


        </Grid>

      </Grid>
   </div>
  )
}

