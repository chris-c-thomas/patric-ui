import React, { useState, useReducer } from 'react'

import {
  isSignedIn, getUser, SignInForm,
  AppHeader, SubmitBtns, AppStatus,
  submitApp, config, Root, Section, Row, Step, useAppParams
} from './common'

import ReadSelector from './components/ReadSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/Selector'
import WSFileName from './components/WSFileName'

const appName = 'MetagenomicReadMapping'
const userGuideURL = `${config.docsURL}/user_guides/services/metagenomic_read_mapping_service.html`
const tutorialURL = `${config.docsURL}/tutorial/metagenomic_read_mapping/metagenomic_read_mapping.html`


const example = {
  paired_end_libs: [],
  single_end_libs: [{
    read: '/PATRIC@patricbrc.org/PATRIC Workshop/Metagenomic Read Mapping/UC.MICU.02.30.fastq'
  }],
  srr_ids: [],
  gene_set_feature_group: '',
  gene_set_name: 'CARD',
  gene_set_type: 'predefined_list',
  gene_set_fasta: '',
  output_path: `/${getUser(true)}/home`,
  output_file: "metagenomic-read-mapping example"
}

const initialState = {
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
  gene_set_feature_group: '',
  gene_set_name: 'CARD',
  gene_set_type: 'predefined_list',
  gene_set_fasta: '',
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


export default function MetagenomicReadMapping() {
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

  const isStep1Complete = () =>
    form.paired_end_libs.length > 0 ||
    form.single_end_libs.length > 0 ||
    form.srr_ids.length > 0

  const isStep2Complete = () => form.gene_set_name

  const isStep3Complete = () => !!form.output_path  && !!form.output_file


  const serviceForm = (
    <>
      <Step number="1" label="Input File(s)" completed={isStep1Complete()} />

      <Section>
        <ReadSelector
          paired_end_libs={form.paired_end_libs}
          single_end_libs={form.single_end_libs}
          srr_ids={form.srr_ids}
          onChange={(field, val) => dispatch({field, val})}
        />
      </Section>

      <Step number="2" label="Set Parameters" completed={isStep2Complete()} />

      <Section column padRows>
        <Row>
          <Selector
            label="Predefined Gene Set Name"
            value={form.gene_set_name}
            onChange={val => dispatch({field: 'gene_set_name', val})}
            width="200px"
            options={[
              {label: 'CARD', value: 'CARD'},
              {label: 'VFDB', value: 'VFDB'},
            ]}
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
        title="Metagenomic Read Mapping"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Metagenomic Read Mapping Service uses KMA to align reads against antibiotic resistance genes from CARD and virulence factors from VFDB.
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
