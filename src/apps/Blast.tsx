import React, { useState, useReducer } from 'react'

import {
  isSignedIn, getUser, SignInForm,
  AppHeader, SubmitBtns, AppStatus,
  submitApp, config, Root, Section, Row, Step
} from './common'

import GenomeSelector from './components/GenomeSelector'

const appName = 'GenomeAnnotation'
const userGuideURL =  `${config.docsURL}/services/blast.html`
const tutorialURL = `${config.docsURL}/tutorial/blast/blast.html`


const example = {}


const initialState = {
}

const reducer = (state, action) => {
  if (action == 'RESET')
    return initialState
  else if (action == 'EXAMPLE')
    return example
  else {
    return {...state, [action.field]: action.val}
  }
}


export default function Blast() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState(null)

  const onSubmit = () => {
    setStatus('starting')
  }

  const isStep1Complete = () => false

  const isStep2Complete = () => false


  const serviceForm = (
    <>
      <Step noNumber label="Sequnce" completed={isStep1Complete()}/>

      <Section column padRows>
        <Row>
          <GenomeSelector
            onChange={genome => dispatch({field: 'targetGenome', val: genome.genome_id})}
          />
        </Row>

      </Section>

      <SubmitBtns
        disabled={!(isStep1Complete() && isStep2Complete())}
        onSubmit={onSubmit}
        status={status}
        onReset={() => dispatch('RESET')}
      />

      <AppStatus name={appName} status={status} />
    </>
  )

  return (
    <Root small>
      <AppHeader
        title="BLAST"
        // onUseExample={() => dispatch('EXAMPLE')}
        description="The PATRIC BLAST service integrates the BLAST (Basic Local Aligment Search Tool) algorithms to perform searches against against public or private genomes in PATRIC or other reference databases using a DNA or protein sequence and find matching genomes, genes, RNAs, or proteins"
        userGuideURL={userGuideURL}
        tutorialURL={tutorialURL}
      />

      <br/>
      {isSignedIn() ? serviceForm : <SignInForm type="service" />}
    </Root>
  )
}