import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import Grid from '@material-ui/core/Grid'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import Subtitle from '../../subtitle'


import {get} from 'axios'
import MobileStepper from './stepper'


const newsURL = 'https://docs.patricbrc.org/_static/carousel.json'

export default function News() {
  const [steps, setSteps] = useState(null)

  useEffect(() => {
    get(newsURL).then(({data}) => {
      setSteps(data)
    })
  }, [])

  return (
    <Root>
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
    </Root>
  )
}

const Root = styled.div`
  padding: 10px;
`