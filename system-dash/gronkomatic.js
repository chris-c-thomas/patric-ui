import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import raceData from './data/by-host_name.json'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider'
import Tooltip from '@material-ui/core/Tooltip'

import PlayIcon from '@material-ui/icons/PlayCircleOutlineRounded'
import ReplayIcon from '@material-ui/icons/ReplayRounded'
import RewindIcon from '@material-ui/icons/FastRewindRounded'
import StopIcon from '@material-ui/icons/Stop'

import Subtitle from '../src/home/subtitle';
import {months} from '../src/utils/dates';

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

const renderDay = (date) => {
  const d = new Date(date);

  if (isNaN(d))
    console.error('*** Data sanitization issue: ', date, 'is not valid')

  const [yyyy, mm, dd] = [d.getFullYear(), months[d.getMonth()], d.getDate()]

  return (
    <div className="flex">
      <span style={{fontSize: '3.0em', fontWeight: 800}} className="column">{yyyy}</span>
      <span style={{margin: '5px 5px'}} className="column">
        <span style={{fontSize: '1.4em'}}>{mm}</span>
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


function ValueLabelComponent(props) {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
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

export default function Insights() {
  const styles = useStyles();

  const lastIdx = raceData.length - 1;

  const [current, setCurrent] = useState(lastIdx);
  const [data, setData] = useState(null);

  const [date, setDate] = useState(raceData[lastIdx].date);
  const [field, setField] = useState('isolation_country');

  const [play, setPlay] = useState(false);
  const [reset, setReset] = useState(false);


  // effect for play button
  useEffect(() => {
    setData( getDayData(raceData[current]) )

    if (!play) return;

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
  }, [current, play])


  // effect for date change
  useEffect(() => {
    const day = raceData[current].date
    setDate(day)
  }, [current])


  const replaySim = () => {
    setCurrent(0)
    setPlay(true)
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

            <Grid container alignItems="center">
              <Grid item xs={3}>
                {date && renderDay(date)}
              </Grid>

              <Grid item xs={6}>
                <Slider
                  className={styles.slider}
                  value={current}
                  getAriaValueText={() => date}
                  aria-labelledby="discrete-slider"
                  onChange={(evt, idx) => setCurrent(idx)}
                  min={0}
                  max={lastIdx}
                  valueLabelDisplay="auto"
                  ValueLabelComponent={ValueLabelComponent}
                  valueLabelFormat={i => new Date(raceData[i].date).toLocaleDateString('sv-SE')}
                />
              </Grid>

              <Grid item xs={3}>
                {!play && current != 0 &&
                  <Button color="primary"
                    variant="contained"
                    onClick={replaySim}
                    disableRipple
                    style={{marginRight: 5}}
                  >
                    <ReplayIcon/> Replay
                  </Button>
                }
                {
                  lastIdx !== current &&
                  <Button color="primary"
                    variant="contained"
                    onClick={() => setPlay(!play)}
                    disableRipple
                    style={{width: 20}}
                  >
                    {play ? <StopIcon /> : <PlayIcon />}
                    {play ? ' Stop' : ' Play'}
                  </Button>
                }
              </Grid>
            </Grid>

            {data && <Chart data={data} /> }
          </Paper>


        </Grid>

      </Grid>
   </div>
  )
}

