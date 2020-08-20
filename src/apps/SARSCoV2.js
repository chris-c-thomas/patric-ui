import React, { useState, useReducer } from 'react'

import { Root, Section, Row } from './FormLayout'
import Step from './components/Step'
import ReadSelector from './components/ReadSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/selector'
import Radio from './components/Radio'
import TextInput from './components/TextInput'
import TaxonSelector from './components/TaxonSelector'

import { AppHeader, SubmitBtns } from './partials'

// auth is required
import { isSignedIn, getUser} from '../api/auth'
import SignInForm from '../auth/sign-in-form'

import config from '../config.js'
const userGuideURL = `${config.docsURL}/user_guides/services/genome_assembly_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_assembly/assembly.html`


const example = {
  reads: [{ // not ssent to server
    type: 'srr_ids',
    label: 'ERR4208068',
    value: 'ERR4208068'
  }],
  srr_ids: ['ERR4208068'],
  recipe: 'auto',
  domain: 'Viruses',
  trim: false,
  scientific_name: 'Severe acute respiratory syndrome coronavirus 2',
  output_path: `/${getUser(true)}/home`,
  output_file: 'Severe acute respiratory syndrome coronavirus 2 test',
  skip_indexing: true
}

const initialState = {
  reads: [],  // not sent to server
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
  contigs: null,
  scientific_name: 'Severe acute respiratory syndrome coronavirus 2',
  tax_id: '2697049',
  recipe: 'auto',
  output_path: null,
  output_file: null,
  skip_indexing: true
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

export default function SARSCoV2() {
  const [form, dispatch] = useReducer(reducer, initialState)

  const [startWith, setStartWith] = useState('reads')

  function onSubmit() {
    alert(JSON.stringify(form, null, 4))
  }

  const serviceForm = (
    <>
      <Step noNumber label="Start with" />

      <Section>
        <Radio
          row
          value={startWith}
          options={[
            {label: 'Read file', value: 'reads'},
            {label: 'Assembled contigs', value: 'contigs'},
          ]}
          onChange={val => setStartWith(val)}
        />
      </Section>

      {startWith == 'reads' &&
        <>
          <Step number="1" label="Input File(s)" completed={form.reads.length > 0} />

          <Section>
            <ReadSelector
              reads={form.reads}
              onChange={reads => dispatch({field: 'reads', reads})}
            />
          </Section>
        </>
      }

      {startWith == 'contigs' &&
        <>
          <Step number="1" label="Input File(s)" completed={form.contigs} />

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
        </>
      }


      <Step number="2" label="Set Parameters" completed={true} />

      <Section column>
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
            taxonId={form.tax_id}
            namePlaceholder="e.g. SARS CoV"
            onNameChange={({taxon_name}) => dispatch({field: 'scientific_name', val: taxon_name})}
            onIdChange={({taxon_id}) => dispatch({field: 'tax_id', val: taxon_id})}
          />
        </Row>
      </Section>


      <Step number="3" label="Select Output" completed={form.output_path != null && form.output_file != null} />

      <Section column>
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

        <TextInput
          value={form.output_file}
          onChange={val => dispatch({field: 'output_file', val})}
          label="My Label"
          style={{width: 250}}
        />
      </Section>

      <Section>
        <SubmitBtns
          onSubmit={onSubmit}
          onReset={() => dispatch('RESET')}
        />
      </Section>
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
            The service attempts to select the best assembly. For further explanation, please see
            the <a href={userGuideURL} target="_blank">User Guide</a> and <a href={tutorialURL} target="_blank">Tutorial</a>.
          </>
        }
        userGuideURL={userGuideURL}
      />

      <br/>

      {isSignedIn() ? serviceForm : <SignInForm forApp />}
    </Root>
  )
}

