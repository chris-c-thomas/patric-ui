import React, { useState, useReducer } from 'react'

import { Root, Section, Row } from './common/FormLayout'
import AppHeader from './common/AppHeader'
import SubmitBtns from './common/SubmitBtns'
import AppStatus from './common/AppStatus'

import Step from './components/Step'
import ObjectSelector from './components/object-selector/ObjectSelector'
import WSFileName from './components/WSFileName'
import GenomeSelector from './components/GenomeSelector'
import AdvancedButton from './components/AdvancedButton'

// auth is required
import { isSignedIn } from '../api/auth'
import SignInForm from '../auth/SignInForm'

// import { submitApp } from '../api/app-service'

import config from '../config'

const appName = 'GenomeAnnotation'
const userGuideURL =  `${config.docsURL}/user_guides/services/genome_alignment_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_alignment/genome_alignment.html`


const example = {
}


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

const getValues = (form) => {
  let params = {...form}
  params.scientific_name = `${form.scientific_name} ${form.my_label}`
  return params
}

export default function GenomeAlignment() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState(null)

  const [advParams, setAdvParams] = useState(false)

  const onSubmit = () => {
    const values = getValues(form)
    setStatus('starting')
  }

  const isStep1Complete = () =>
    form.contigs && form.domain && form.scientific_name && form.taxonomy_id &&
    form.code && form.recipe

  const isStep2Complete = () =>
    form.output_path != null && form.output_file != null


  const serviceForm = (
    <>
      <Step number="1" label="Select Genomes" completed={isStep1Complete()}/>

      <Section column padRows>
        <Row>
          <GenomeSelector />
        </Row>

        <Row>
          <ObjectSelector
            label="And/or select genome group(s)"
            value={null}
            type="genome_group"
            dialogTitle="Select genome group"
            width="200px"
          />
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
          value={form.my_label}
          onChange={val => dispatch({field: 'my_label', val})}
          label="My Label"
          placeholder="My label 123"
          prefix={form.scientific_name}
          width="200px"
        />

        <AdvancedButton onClick={open => setAdvParams(open)} className="justify-start" />

        {advParams &&
          <Row>
            <p>
              advanced stuff goes here
            </p>
          </Row>

        }
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
        title="Genome Alignment"
        // onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Whole Genome Alignment Service aligns genomes using <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0011147" target="_blank">progressiveMauve</a>.
          </>
        }
        userGuideURL={userGuideURL}
        tutorialURL={tutorialURL}
      />

      <br/>
      {isSignedIn() ? serviceForm : <SignInForm forApp />}
    </Root>
  )
}