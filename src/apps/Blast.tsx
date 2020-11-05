import React, { useState, useReducer } from 'react'

import { Root, Section, Row } from './common/FormLayout'
import AppHeader from './common/AppHeader'
import SubmitBtns from './common/SubmitBtns'
import AppStatus from './common/AppStatus'

import Step from './components/Step'
import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/Selector'
import WSFileName from './components/WSFileName'
import TaxonSelector from './components/TaxonSelector'
import GenomeSelector from './components/GenomeSelector'

// auth is required
import { isSignedIn, getUser } from '../api/auth'
import SignInForm from '../auth/SignInForm'

import { submitApp } from '../api/app-service'

import config from '../config'
const appName = 'GenomeAnnotation'
const userGuideURL =  `${config.docsURL}/user_guides/services/genome_annotation_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_annotation/annotation.html`


const example = {}


const initialState = {
  contigs: null,
  domain: 'Bacteria',
  recipe: 'default',
  scientific_name: null,
  taxonomy_id: null,
  code: 11,
  output_path: null,
  my_label: null,
  get output_file() { return `${this.scientific_name} ${this.my_label}` }
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

export default function Blast() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState(null)

  const onSubmit = () => {
    const values = getValues(form)
    setStatus('starting')
  }

  const isStep1Complete = () =>
    form.contigs && form.domain && form.scientific_name && form.taxonomy_id &&
    form.code && form.recipe

  const isStep2Complete = () =>
    form.output_file && form.my_label


  const serviceForm = (
    <>
      <Step noNumber label="Sequnce" completed={isStep1Complete()}/>

      <Section column padRows>
        <Row>
          <GenomeSelector />
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
        description="The Genome Annotation Service uses the RAST tool kit (RASTtk) to provide annotation of genomic features."
        userGuideURL={userGuideURL}
        tutorialURL={tutorialURL}
      />

      <br/>
      {isSignedIn() ? serviceForm : <SignInForm type="service" />}
    </Root>
  )
}