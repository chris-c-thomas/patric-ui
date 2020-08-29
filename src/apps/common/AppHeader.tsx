import React from 'react'
import styled from 'styled-components'
import {useLocation} from 'react-router-dom'
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import UserGuideDialog from '../components/UserGuideDialog'

import { isSignedIn } from '../../api/auth'


import urlMapping from '../../jobs/url-mapping'
const p3Url = 'https://alpha.bv-brc.org'


const getP3Url = (name) => {
  const invert = {}
  for(const key in urlMapping){
    invert[urlMapping[key]] = key
  }

  return `${p3Url}/app/${invert[name]}`
}

type Props = {
  title: string;
  description: string;
  tutorialURL: string;
  userGuideURL: string;
  onUseExample: () => void;
}

export default function AppHeader(props: Props) {
  const {
    title, description,
    userGuideURL, onUseExample, tutorialURL
  } = props

  const appName = useLocation().pathname.split('/').pop()

  return (
    <Grid container spacing={1}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h5" component="h3">
            {title} <UserGuideDialog url={userGuideURL} />
          </Typography>
        </Grid>

        {isSignedIn() && onUseExample &&
          <Grid item>
            <small><a onClick={onUseExample}>use example</a></small>
          </Grid>
        }
        <P3Link href={getP3Url(appName)} target="_blank">p3</P3Link>

      </Grid>

      <Grid item>
        <AppDescription>
          {description}
          For further explanation, please see the{' '}
          <a href={userGuideURL} target="_blank" rel="noopener noreferrer">User Guide </a> and{' '}
          <a href={tutorialURL} target="_blank" rel="noopener noreferrer">Tutorial</a>.
        </AppDescription>
      </Grid>
    </Grid>
  )
}

const AppDescription = styled.span`
  font-size: .9em;
`


const P3Link = styled.a`
  position: absolute;
  top: 50;
  right: 50;
  opacity: .7;
`
