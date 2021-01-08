import React, { useState, useReducer } from 'react'

import {
  isSignedIn, getUser, SignInForm,
  AppHeader, SubmitBtns, AppStatus,
  submitApp, config, Root, Section, Row, Step, useAppParams
} from './common'

import ReadSelector from './components/ReadSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import SelectedTable from './components/SelectedTable'
import GenomeSelector from './components/GenomeSelector'
import Selector from './components/Selector'
import TextInput from './components/TextInput'
import AdvancedButton from './components/AdvancedButton'
import WSFileName from './components/WSFileName'

const appName = 'FastqUtils'
const userGuideURL = `${config.docsURL}/user_guides/services/fastq_utilities_service.html`
const tutorialURL = `${config.docsURL}/tutorial/fastq-utilities/fastq-utilities.html`


const example = {
  paired_end_libs: [],
  single_end_libs: [{
    read1: '/PATRIC@patricbrc.org/PATRIC Workshop/Variation/Mycobacterium_leprae_example/SK2_SRR847034_1.fastq.gz',
  }],
  srr_ids: [],
  reference_genome_id: "272631.5",
  output_path: `/${getUser(true)}/home`,
  output_file: "fastq example"
}

const initialState = {
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
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


export default function FastqUtil() {
  const json = useAppParams()
  const [form, dispatch] = useReducer(reducer, {...initialState, ...json})
  const [status, setStatus] = useState(null)

  const [advParams, setAdvParams] = useState(false)
  const [rows] = useState([])

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

  const isStep2Complete = () => form.reference_genome_id

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

      <Step number="2" label="Select Pipeline" completed={isStep2Complete()} />

      <Section column padRows>
        <Row>

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
        title="Fastq Utilities"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Fastq Utilites Service provides capability for aligning, measuring base call quality, and trimmiing fastq read files.
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
