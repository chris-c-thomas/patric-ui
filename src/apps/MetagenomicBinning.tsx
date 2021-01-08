import React, { useState, useReducer } from 'react'

import {
  isSignedIn, getUser, SignInForm,
  AppHeader, SubmitBtns, AppStatus,
  submitApp, config, Root, Section, Row, Step, useAppParams
} from './common'

import PairedReadSelector from './components/PairedReadSelector'
import Radio from './components/Radio'
import ObjectSelector from './components/object-selector/ObjectSelector'
import WSFileName from './components/WSFileName'

const appName = 'MetagenomeBinning'
const userGuideURL = `${config.docsURL}/user_guides/services/metagenomic_binning_service.html`
const tutorialURL = `${config.docsURL}/tutorial/metagenomic_binning/metagenomic_binning.html`


const example = {
  paired_end_libs: [],
  input_type: 'reads',
  contigs: null,
  genome_group: 'metagenomic-binning-group',
  output_path: `/${getUser(true)}/home`,
  output_file: "metagenomic-binning example"
}

const initialState = {
  paired_end_libs: [],
  input_type: 'reads',
  contigs: null,
  genome_group: null,
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

export default function MetagenomicBinning() {
  const json = useAppParams()
  const [form, dispatch] = useReducer(reducer, {...initialState, ...json})
  const [status, setStatus] = useState(null)

  const onSubmit = () => {
    const params = {...form}

    setStatus('starting')
    submitApp(appName, params)
      .then(() => setStatus('success'))
      .catch(error => setStatus(error))
  }

  const hasReads = () =>
    form.paired_end_libs.length > 0

  const hasContigs = () =>
    form.contigs

  const isStep1Complete = () =>
    hasReads() || hasContigs()

  const isStep2Complete = () => !!form.output_path  && !!form.output_file && !!form.genome_group

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
          <PairedReadSelector
            paired_end_libs={form.paired_end_libs}
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
            value={form.output_file}
            onChange={val => dispatch({field: 'output_file', val})}
            label="Output Name"
            placeholder="Output name"
            width="200px"
          />
        </Row>

        <Row>
          <WSFileName
            value={form.genome_group}
            onChange={val => dispatch({field: 'genome_group', val})}
            label="Genome Group Name"
            placeholder="My Genome Group"
            width="200px"
          />
        </Row>
      </Section>

      <SubmitBtns
        onSubmit={onSubmit}
        onReset={() => dispatch('RESET')}
        status={status}
        disabled={!isStep1Complete() || !isStep2Complete()}
      />

      <AppStatus name={appName} status={status} />
    </>
  )


  return (
    <Root>
      <AppHeader
        title="Metagenomic Binning"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Metagenomic Binning Service accepts either reads or contigs, and attempts to "bin" the data into a set of genomes. This service can be used to reconstruct bacterial and archael genomes from environmental samples.
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
