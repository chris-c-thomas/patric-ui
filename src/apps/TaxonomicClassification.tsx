import React, { useState, useReducer } from 'react'

import {
  isSignedIn, getUser, SignInForm,
  AppHeader, SubmitBtns, AppStatus,
  submitApp, config, Root, Section, Row, Step, useAppParams
} from './common'

import ReadSelector from './components/ReadSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/Selector'
import Radio from './components/Radio'
import WSFileName from './components/WSFileName'

const appName = 'TaxonomicClassification'
const userGuideURL = `${config.docsURL}/user_guides/services/taxonomic_classification_service.html`
const tutorialURL = `${config.docsURL}/tutorial/taxonomic_classification/taxonomic_classification.html`


const example = {
  paired_end_libs: [{
    read1: '/PATRIC@patricbrc.org/PATRIC Workshop/Taxonomic_Classification/SRR7796591/SRR7796591_1.fastq.gz',
    read2: '/PATRIC@patricbrc.org/PATRIC Workshop/Taxonomic_Classification/SRR7796591/SRR7796591_2.fastq.gz',
    interleaved: 'false',
    platform: 'infer',
    read_orientation_outward: 'false'
  }],
  single_end_libs: [],
  srr_ids: [],
  contigs: null,
  algorithm: 'Kraken2',
  database: 'Kraken2',
  input_type: 'reads',
  save_classified_sequences: 'false',
  save_unclassified_sequences: 'false',
  reference_genome_id: "272631.5",
  output_path: `/${getUser(true)}/home`,
  output_file: "taxonomic-classification example"
}

const initialState = {
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
  contigs: null,
  algorithm: 'Kraken2',
  database: 'Kraken2',
  input_type: 'reads',
  save_classified_sequences: 'false',
  save_unclassified_sequences: 'false',
  reference_genome_id: null,
  output_path: null,
  output_file: null
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


export default function TaxonomicClassification() {
  const json = useAppParams()
  const [form, dispatch] = useReducer(reducer, {...initialState, ...json})
  const [status, setStatus] = useState(null)

  const [advParams, setAdvParams] = useState(false)

  const onSubmit = () => {
    const params = {...form}

    setStatus('starting')
    submitApp(appName, params)
      .then(() => setStatus('success'))
      .catch(error => setStatus(error))
  }

  const hasReads = () =>
    form.paired_end_libs.length > 0 ||
    form.single_end_libs.length > 0 ||
    form.srr_ids.length > 0

  const hasContigs = () =>
    form.contigs

  const isStep1Complete = () =>
    hasReads() || hasContigs()

  const isStep2Complete = () => form.algorithm && form.database && form.save_classified_sequences && form.save_unclassified_sequences

  const isStep3Complete = () => !!form.output_path  && !!form.output_file


  const serviceForm = (
    <>
      <Step noNumber label="Start with" />

      <Section>
        <Radio
          row
          value={form.input_type}
          options={[
            {label: 'Read file', value: 'reads'},
            {label: 'Assembled Contigs', value: 'contigs'},
          ]}
          onChange={val => dispatch({field: 'input_type', val})}
        />
      </Section>

      <Step number="1" label="Input File(s)" completed={isStep1Complete()} />

      {form.input_type == 'reads' &&
        <Section>
          <ReadSelector
            paired_end_libs={form.paired_end_libs}
            single_end_libs={form.single_end_libs}
            srr_ids={form.srr_ids}
            onChange={(field, val) => dispatch({field, val})}
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
            label="Algorithm"
            value={form.algorithm}
            onChange={val => dispatch({field: 'algorithm', val})}
            width="200px"
            options={[
              {label: 'Kraken2', value: 'Kraken2'},
            ]}
          />
        </Row>

        <Row>
          <Selector
            label="Database"
            value={form.database}
            onChange={val => dispatch({field: 'database', val})}
            width="200px"
            options={[
              {label: 'All Genomes', value: 'Kraken2'},
            ]}
          />
        </Row>

        <Row>
          <Radio
            row
            legend="Save Classified Sequences"
            value={form.save_classified_sequences}
            options={[
              {label: 'No', value: 'false'},
              {label: 'Yes', value: 'true'},
            ]}
            onChange={val => dispatch({field: 'save_classified_sequences', val})}
          />
        </Row>

        <Row>
          <Radio
            row
            legend="Save Unclassified Sequences"
            value={form.save_unclassified_sequences}
            options={[
              {label: 'No', value: 'false'},
              {label: 'Yes', value: 'true'},
            ]}
            onChange={val => dispatch({field: 'save_unclassified_sequences', val})}
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

        <Row>
          <WSFileName
            value={form.output_file}
            onChange={val => dispatch({field: 'output_file', val})}
            label="Output Name"
            placeholder="Output name"
            width="200px"
          />
        </Row>
      </Section>

      <SubmitBtns
        onSubmit={onSubmit}
        onReset={() => dispatch('RESET')}
        status={status}
        disabled={!isStep1Complete() || !isStep3Complete()}
      />

      <AppStatus name={appName} status={status} />
    </>
  )


  return (
    <Root>
      <AppHeader
        title="Taxonomic Classification"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Taxonomic Classification Service computes taxonomic classification for read data.
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
