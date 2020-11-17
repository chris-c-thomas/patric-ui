import React, { useState, useReducer } from 'react'

import {
  isSignedIn, getUser, SignInForm,
  AppHeader, SubmitBtns, AppStatus,
  submitApp, config, Root, Section, Row, Step
} from './common'

import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/Selector'
import WSFileName from './components/WSFileName'
import TaxonSelector from './components/TaxonSelector'

const appName = 'GenomeAnnotation'
const userGuideURL =  `${config.docsURL}/user_guides/services/genome_annotation_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_annotation/annotation.html`


const example = {
  contigs: '/PATRIC@patricbrc.org/PATRIC Workshop/Annotation/Buchnera/Buchnera aphidicola strain Tuc7_SRR4240359.fasta',
  domain: 'Bacteria',
  recipe: 'default',
  scientific_name: 'Buchnera aphidicola',
  taxonomy_id: '1280',
  code: 11,
  output_path: `/${getUser(true)}/home`,
  my_label: 'example'
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
  // output_file: will end up being `${scientific_name} ${my_label}`
  // scientific_name: will end up being `${scientific_name} ${my_label}`
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
  params.output_file = `${form.scientific_name} ${form.my_label}`
  params.scientific_name = `${form.scientific_name} ${form.my_label}`
  return params
}


export default function Annotation() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState<string>(null)

  const onSubmit = () => {
    const values = getValues(form)

    setStatus('starting')
    submitApp(appName, values)
      .then(() => setStatus('success'))
      .catch(error => setStatus(error))
  }

  const isStep1Complete = () =>
    form.contigs && form.domain && form.scientific_name && form.taxonomy_id &&
    form.code && form.recipe

  const isStep2Complete = () => !!form.output_path && !!form.my_label


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
            showHidden
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

        <Row noPad>
          <TaxonSelector
            taxonName={form.scientific_name}
            taxonId={form.taxonomy_id}
            onNameChange={val => dispatch({field: 'scientific_name', val})}
            onIdChange={val => dispatch({field: 'taxonomy_id', val})}
            geneticCode={form.code}
            onGeneticCodeChange={val => dispatch({field: 'code', val})}
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
            onChange={val => dispatch({field: 'output_path', val})}
            placeholder="Select a folder..."
            label="Output Folder"
            type="folder"
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
            showHelperText
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
      {isSignedIn() ? serviceForm : <SignInForm type="service" />}
    </Root>
  )
}