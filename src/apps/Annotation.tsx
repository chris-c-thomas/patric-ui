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

// auth is required
import { isSignedIn, getUser } from '../api/auth'
import SignInForm from '../auth/sign-in-form'

import { submitApp } from '../api/app-service'

import config from '../config'
const appName = 'GenomeAnnotation'
const userGuideURL =  `${config.docsURL}/user_guides/services/genome_annotation_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_annotation/annotation.html`


const example = {
  contigs: '/PATRIC@patricbrc.org/PATRIC Workshop/Annotation/Buchnera/Buchnera aphidicola strain Tuc7_SRR4240359.fasta',
  domain: 'Bacteria',
  recipe: 'default',
  scientific_name: 'Buchnera aphidicola',
  taxonomy_id: 1280,
  code: 11,
  output_path: `/${getUser(true)}/home`,
  my_label: 'example',
  get output_file() { return `${this.scientific_name} ${this.my_label}` }
}

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
  let params = Object.assign({}, form)
  params.scientific_name = `${form.scientific_name} ${form.my_label}`
  return params
}

export default function Annotation() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState(null)

  const onSubmit = () => {
    const values = getValues(form)
    setStatus('starting')
    submitApp(appName, values)
      .then(() => setStatus('success'))
      .catch(error => setStatus(error))
  }

  const isStep1Complete = () =>
    form.contigs && form.domain && form.scientific_name && form.taxonomy_id &&
    form.genCode && form.recipe

  const isStep2Complete = () =>
    form.output_file && form.my_label


  const serviceForm = (
    <>
      <Step number="1" label="Set Parameters" completed={isStep1Complete()}/>

      <Section column padRows>
        <Row>
          <ObjectSelector
            placeholder="Select a contigs file..."
            label="Contigs"
            type="contigs"
            value={form.contigs}
            onChange={val => dispatch({field: 'contigs', val})}
            dialogTitle="Select a contigs file"
          />
        </Row>

        <Row>
          <Selector
            label="Domain"
            value={form.domain}
            onChange={val => dispatch({field: 'domain', val})}
            width="200px"
            options={[
              {value: 'Bacteria', label: 'Bacteria'},
              {value: 'Archea', label: 'Archea'},
              {value: 'Viruses', label: 'Viruses'}
            ]}
          />
        </Row>

        <Row>
          <TaxonSelector
            taxonName={form.scientific_name}
            taxonId={form.taxonomy_id}
            namePlaceholder="e.g. Brucella Cereus"
            onNameChange={({taxon_name}) => dispatch({field: 'scientific_name', val: taxon_name})}
            onIdChange={({taxon_id}) => dispatch({field: 'taxonomy_id', val: taxon_id})}
          />
        </Row>

        <Row>
          <Selector
            label="Genetic Code"
            value={form.code}
            onChange={val => dispatch({field: 'code', val})}
            width="200px"
            options={[
              {value: '11', label: '11 (Archaea & most bacteria)'},
              {value: '4', label: '4 (Mycoplasma, Spiroplasma & Ureaplasma)'},
              {value: '25', label: '25 (Candidate Divsion SR1 & Gracilibacteria)'},
            ]}
          />
        </Row>

        <Row>
          <Selector
            label="Annotation Recipe"
            width="200px"
            value={form.recipe}
            onChange={val => dispatch({field: 'recipe', val})}
            options={[
              {value: 'default', label: 'Bacteria/Archaea'},
              {value: 'phage', label: 'Bacteriophage'},
            ]}
          />
        </Row>
      </Section>

      <Step number="2" label="Select Output" completed={isStep2Complete()} />

      <Section column padRows>
        <Row>
          <ObjectSelector
            value={form.output_path}
            placeholder="Select a folder..."
            label="Output Folder"
            type="Folder"
            dialogTitle="Select a folder"
          />
        </Row>

        <Row>
          <WSFileName
            value={form.my_label}
            onChange={val => dispatch({field: 'my_label', val})}
            label="My Label"
            placeholder="My label 123"
            prefix={form.scientific_name}
            width="200px"
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
        title="Genome Annotation"
        onUseExample={() => dispatch('EXAMPLE')}
        description="The Genome Annotation Service uses the RAST tool kit (RASTtk) to provide annotation of genomic features."
        userGuideURL={userGuideURL}
        tutorialURL={tutorialURL}
      />

      <br/>
      {isSignedIn() ? serviceForm : <SignInForm forApp />}
    </Root>
  )
}