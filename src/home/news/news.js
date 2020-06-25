import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import Subtitle from '../../subtitle';


import {get} from 'axios';
import MobileStepper from './stepper';


const newsURL = "https://docs.patricbrc.org/_static/carousel.json";

export default function News(props) {
  const [steps, setSteps] = useState(null);

  useEffect(() => {
    get(newsURL).then(({data}) => {
      setSteps(data)
    })
  }, [])

  return (
    <Paper className="card">
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Subtitle>
            <a href="https://docs.patricbrc.org/news/index.html" target="_blank">News</a>
            {' '}
            <OpenInNewIcon fontSize="small" />
          </Subtitle>
        </Grid>
        <Grid item>
          {steps && <MobileStepper steps={steps}/>}
        </Grid>
      </Grid>
    </Paper>
  )
}