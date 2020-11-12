import React, { useState, useReducer } from 'react'

import { isSignedIn, getUser } from '../api/auth'
import SignInForm from '../auth/SignInForm'
import { Root, Section, Row } from './common/FormLayout'
import { submitApp } from '../api/app-service'

import AppHeader from './common/AppHeader'
import SubmitBtns from './common/SubmitBtns'
import AppStatus from './common/AppStatus'

import Step from './components/Step'
import ObjectSelector from './components/object-selector/ObjectSelector'
import WSFileName from './components/WSFileName'
import GenomeTableSelector from './components/GenomeTableSelector'
import AdvancedButton from './components/AdvancedButton'

import config from '../config'

const appName = 'GenomeAlignment'
const userGuideURL =  `${config.docsURL}/user_guides/services/genome_alignment_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_alignment/genome_alignment.html`

const example = {
  hmmPGoUnrelated: null,
  hmmPGoHomologous: null,
  maxBreakpointDistanceScale: null,
  seedWeight: null,
  maxGappedAlignerLength: null,
  genome_ids: [
    '224914.11',
    '204722.5',
    '568815.3',
    '359391.4',
    '262698.4'
  ],

  minScaledPenalty: null,
  weight: null,
  recipe: 'progressiveMauve',
  conservationDistanceScale: null,
  output_path: `/${getUser(true)}/home`,
  output_file: '5 Brucella genomes 16M reference',
}

const initialState = {
  hmmPGoUnrelated: null,
  hmmPGoHomologous: null,
  maxBreakpointDistanceScale: null,
  seedWeight: null,
  maxGappedAlignerLength: null,
  genome_ids: [],
  minScaledPenalty: null,
  weight: null,
  recipe: 'progressiveMauve',
  conservationDistanceScale: null,
  output_path: null,
  output_file: null
}

const reducer = (state, action) => {
  if (action == 'RESET')
    return initialState
  else if (action == 'EXAMPLE')
    return example
  else if (action.type == 'ADD_GENOME')
    return { ...state, genome_ids: [...state.genome_ids, action.val] }
  else if (action.type == 'ADD_GENOME_GROUP')
    return { ...state, genome_ids: [...state.genome_ids, ...action.val] }
  else if (action.type == 'REMOVE_GENOME')
    return { ...state, genome_ids: state.genome_ids.filter((_, i) => i != action.val) }
  else
    return { ...state, [action.field]: action.val }
}



export default function GenomeAlignment() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState(null)
  // const [advParams, setAdvParams] = useState(false)


  const onSubmit = () => {
    setStatus('starting')
    submitApp(appName, form)
      .then(() => setStatus('success'))
      .catch(error => setStatus(error))
  }


  const isStep1Complete = () => !!form.genome_ids.length

  const isStep2Complete = () => !!form.output_path && !!form.output_file


  const serviceForm = (
    <>
      <Step number="1" label="Select Genomes" completed={isStep1Complete()}/>

      <Section column padRows>
        <Row>
          <GenomeTableSelector genomeIDs={form.genome_ids} dispatch={dispatch} />
        </Row>
      </Section>


      <Step number="2" label="Select Output" completed={isStep2Complete()} />

      <Section column padRows>
        <Row>
          <ObjectSelector
            value={form.output_path}
            onChange={val => dispatch({field: 'output_path', val})}
            placeholder="Select a folder..."
            label="Output Folder"
            type="folder"
            dialogTitle="Select a folder"
          />
        </Row>

        <WSFileName
          value={form.output_file}
          onChange={val => dispatch({ field: 'output_file', val })}
          label="Output Name"
          placeholder="Output name"
        />
      </Section>


      {/*
        <Section>
          <AdvancedButton onClick={open => setAdvParams(open)} className="justify-start" />

          {advParams &&
            <Row>
                advanced stuff goes here
            </Row>
          }
        </Section>
      */}


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
        title="Genome Alignment"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Whole Genome Alignment Service aligns genomes using <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0011147" target="_blank">progressiveMauve</a>.
          </>
        }
        userGuideURL={userGuideURL}
        tutorialURL={tutorialURL}
      />

      <br/>
      {isSignedIn() ? serviceForm : <SignInForm type="service" />}
    </Root>
  )
}