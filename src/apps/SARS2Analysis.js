import React, { useState, useReducer } from 'react'

import { Root, Section, Row } from './common/FormLayout'
import AppHeader from './common/AppHeader'
import SubmitBtns from './common/SubmitBtns'
import AppStatus from './common/AppStatus'

import Step from './components/Step'
import ReadSelector from './components/ReadSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/selector'
import Radio from './components/Radio'
import TaxonSelector from './components/TaxonSelector'
import WSFileName from './components/WSFileName'

// auth is required
import { isSignedIn, getUser} from '../api/auth'
import SignInForm from '../auth/sign-in-form'

import { submitApp } from '../api/app-service'

import config from '../config'
const appName = 'ComprehensiveSARS2Analysis'
const userGuideURL = `${config.docsURL}/user_guides/services/genome_assembly_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_assembly/assembly.html`


const example = {
  input_type: 'reads',
  skip_indexing: true,
  reads: [{ // not sent to server
    type: 'srr_ids',
    label: 'ERR4208068',
    value: 'ERR4208068'
  }],
  srr_ids: ['ERR4208068'],
  recipe: 'auto',
  domain: 'Viruses',
  code: '1',
  scientific_name: 'Severe acute respiratory syndrome coronavirus 2',
  taxonomy_id: '2697049',
  output_path: `/${getUser(true)}/home`,
  my_label: 'example',
  get output_file() { return `${this.scientific_name} ${this.my_label}` }
}


const initialState = {
  input_type: 'reads',
  skip_indexing: true,
  reads: [],  // not sent to server
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
  contigs: null,
  domain: 'Viruses',
  code: '1',
  scientific_name: 'Severe acute respiratory syndrome coronavirus 2',
  taxonmy_id: '2697049',
  recipe: 'auto',
  output_path: null,
  my_label: null,
  get output_file() { return `${this.scientific_name} ${this.my_label}` }
}

const reducer = (state, action) => {
  if (action == 'RESET')
    return initialState
  else if (action == 'EXAMPLE')
    return example
  else if (action.field == 'reads') {
    const {reads} = action
    return {
      ...state,
      paired_end_libs: reads.filter(o => o.type == 'paired_end_libs').map(o => o.value),
      single_end_libs: reads.filter(o => o.type == 'single_end_libs').map(o => o.value),
      srr_ids: reads.filter(o => o.type == 'srr_ids').map(o => o.value)
    }
  } else {
    return {...state, [action.field]: action.val}
  }
}

const getValues = (form) => {
  let params = Object.assign({}, form)
  params.scientific_name = `${form.scientific_name} ${form.my_label}`
  delete params.reads
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

  const isStep1Complete = () =>
    form.input_type == 'reads' && form.reads.length > 0 ||
    form.input_type == 'contigs' && form.contigs

  const isStep2Complete = () => {
    return form.scientific_name && form.taxonomy_id
  }

  const isStep3Complete = () =>
    form.output_path != null && form.output_file != null


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
            reads={form.reads}
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
            taxonId={form.taxonmy_id}
            namePlaceholder="e.g. SARS CoV"
            onNameChange={({taxon_name}) => dispatch({field: 'scientific_name', val: taxon_name})}
            onIdChange={({taxon_id}) => dispatch({field: 'taxonmy_id', val: taxon_id})}
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
            type="Folder"
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

      {isSignedIn() ? serviceForm : <SignInForm forApp />}
    </Root>
  )
}

