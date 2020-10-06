import React from 'react'
import styled from 'styled-components'
import {useLocation} from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import UserGuideDialog from '../components/UserGuideDialog'

import { isSignedIn } from '../../api/auth'

import { Section } from './FormLayout'


// import urlMapping from '../../jobs/url-mapping'
const p3Url = 'https://alpha.bv-brc.org'


const getP3Url = (name) => `${p3Url}/app/${name}`


type Props = {
  title: string;
  description: string | JSX.Element;
  tutorialURL: string;
  userGuideURL: string;
  onUseExample?: () => void;
}


export default function AppHeader(props: Props) {
  const {
    title, description,
    userGuideURL, onUseExample, tutorialURL
  } = props

  const appName = useLocation().pathname.split('/').pop()

  return (
    <Section column noIndent>
      <div className="flex space-between align-items-center">
        <Typography variant="h5" component="h3">
          {title} <UserGuideDialog url={userGuideURL} />
        </Typography>

        {isSignedIn() && onUseExample &&
          <SampleData>
            <small><a onClick={onUseExample}>use example</a></small>
          </SampleData>
        }
      </div>

      <AppDescription>
        {description}{' '}
        For further explanation, please see the{' '}
        <a href={userGuideURL} target="_blank" rel="noopener noreferrer">User Guide </a> and{' '}
        <a href={tutorialURL} target="_blank" rel="noopener noreferrer">Tutorial</a>.
      </AppDescription>

      <P3Link href={getP3Url(appName)} target="_blank">p3</P3Link>
    </Section>
  )
}


const AppDescription = styled.span`
  font-size: .9em;
`

const SampleData = styled.div`
  position: relative;
  top: 0;
`

const P3Link = styled.a`
  position: absolute;
  top: 50;
  right: 50;
  opacity: .7;
`
