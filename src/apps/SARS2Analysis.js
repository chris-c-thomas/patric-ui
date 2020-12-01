import React, { useState, useReducer } from 'react'

import {
  isSignedIn, getUser, SignInForm,
  AppHeader, SubmitBtns, AppStatus,
  submitApp, config, Root, Section, Row, Step
} from './common'

import ReadSelector from './components/ReadSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/Selector'
import Radio from './components/Radio'
import TaxonSelector from './components/TaxonSelector'
import WSFileName from './components/WSFileName'

const appName = 'ComprehensiveSARS2Analysis'
const userGuideURL = `${config.docsURL}/user_guides/services/genome_assembly_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_assembly/assembly.html`


const example = {
  input_type: 'reads',
  skip_indexing: true,
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: ['ERR4208068'],
  recipe: 'auto',
  domain: 'Viruses',
  code: '1',
  scientific_name: 'Severe acute respiratory syndrome coronavirus 2',
  taxonomy_id: '2697049',
  output_path: `/${getUser(true)}/home`,
  my_label: 'example',
}


const initialState = {
  input_type: 'reads',
  skip_indexing: true,
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
  contigs: null,
  domain: 'Viruses',
  code: '1',
  scientific_name: 'Severe acute respiratory syndrome coronavirus 2',
  taxonomy_id: '2697049',
  recipe: 'auto',
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
  else if (action.field == 'reads')
    return {...state, ...action.reads}
  else {
    return {...state, [action.field]: action.val}
  }
}

const getValues = (form) => {
  let params = {...form}
  params.scientific_name = `${form.scientific_name} ${form.my_label}`
  params.output_file = `${form.scientific_name} ${form.my_label}`
  return params
}


export default function SARSCoV2() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState(null)

  const onSubmit = () => {
    const values = getValues(form)
    setStatus('starting')
    submitApp(appName, values)
      .then(() => setStatus('success'))
      .catch(error => setStatus(error))
  }

  const hasReads = () =>
    form.paired_end_libs.length > 0 ||
    form.single_end_libs.length > 0 ||
    form.srr_ids.length > 0

  const isStep1Complete = () =>
    (form.input_type == 'reads' && hasReads()) ||
    (form.input_type == 'contigs' && form.contigs)


  const isStep2Complete = () =>
    isStep1Complete() && form.scientific_name && form.taxonomy_id


  const isStep3Complete = () =>
    form.output_path != null && !!form.my_label


  const serviceForm = (
    <>
      <Step noNumber label="Start with" />

      <Section>
        <Radio
          row
          value={form.input_type}
          options={[
            {label: 'Read file', value: 'reads'},
            {label: 'Assembled contigs', value: 'contigs'},
          ]}
          onChange={val => dispatch({field: 'input_type', val})}
        />
      </Section>

      <Step number="1" label="Input File(s)" completed={isStep1Complete()} />

      {form.input_type == 'reads' &&
        <Section>
          <ReadSelector
            reads={{
              paired_end_libs: form.paired_end_libs,
              single_end_libs: form.single_end_libs,
              srr_ids: form.srr_ids
            }}
            onChange={reads => dispatch({field: 'reads', reads})}
          />
        </Section>
      }

      {form.input_type == 'contigs' &&
        <Section>
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
        </Section>
      }


      <Step number="2" label="Set Parameters" completed={isStep2Complete()} />

      <Section column padRows>
        <Row>
          <Selector
            label="Assembly Strategy"
            value={form.recipe}
            onChange={val => dispatch({field: 'recipe', val})}
            width="200px"
            options={[
              {label: 'Auto', value: 'auto'},
              {label: 'CDC-Illumina', value: 'cdc-illumina'},
              {label: 'CDC-Nanopore', value: 'cdc-nanopore'},
              {label: 'ARTIC-Nanopore', value: 'artic-nanopore'},
            ]}
          />
        </Row>

        <Row>
          <TaxonSelector
            taxonName={form.scientific_name}
            taxonId={form.taxonomy_id}
            namePlaceholder="e.g. SARS CoV"
            onNameChange={val => dispatch({field: 'scientific_name', val})}
            onIdChange={val => dispatch({field: 'taxonomy_id', val})}
          />
        </Row>
      </Section>


      <Step number="3" label="Select Output" completed={isStep3Complete()} />

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
          showHelperText
        />
      </Section>

      <SubmitBtns
        disabled={!(isStep1Complete() && isStep2Complete() && isStep3Complete())}
        onSubmit={onSubmit}
        onReset={() => dispatch('RESET')}
        status={status}
      />

      <AppStatus name={appName} status={status} />
    </>
  )


  return (
    <Root>
      <AppHeader
        title="SARS-COV-2 Genome Annotation and Assembly"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            This service allows single or multiple assemblers to be invoked to compare results.
            The service attempts to select the best assembly.
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

