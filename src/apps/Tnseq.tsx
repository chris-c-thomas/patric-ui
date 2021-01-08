import React, { useState, useReducer } from 'react'

import {
  isSignedIn, getUser, SignInForm,
  AppHeader, SubmitBtns, AppStatus,
  submitApp, config, Root, Section, Row, Step, useAppParams
} from './common'

import ReadSelector from './components/ReadSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import GenomeSelector from './components/GenomeSelector'
import Selector from './components/Selector'
import TextInput from './components/TextInput'
import AdvancedButton from './components/AdvancedButton'
import WSFileName from './components/WSFileName'

const appName = 'TnSeq'
const userGuideURL = `${config.docsURL}/user_guides/services/tn_seq_analysis_service.html`
const tutorialURL = `${config.docsURL}/tutorial/tn-seq/tn-seq.html`


const example = {
  paired_end_libs: [],
  single_end_libs: [{
    read: '/PATRIC@patricbrc.org/PATRIC Workshop/Tn-Seq/U19_73_R1.fastq.gz'
  }],
  srr_ids: [],
  recipe: 'gumbel',
  protocol: 'sassetti',
  primer_trimming: 'Default',
  reference_genome_id: "272631.5",
  output_path: `/${getUser(true)}/home`,
  output_file: "tn-seq example"
}

const initialState = {
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
  recipe: 'gumbel',
  protocol: 'sassetti',
  primer_trimming: 'Default',
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


export default function Tnseq() {
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

      <Step number="2" label="Set Parameters" completed={isStep2Complete()} />

      <Section column padRows>
        <Row>
          <Selector
            label="Strategy"
            value={form.recipe}
            onChange={val => dispatch({field: 'recipe', val})}
            width="300px"
            options={[
              {label: 'Essential (gumbel or tn5gaps)', value: 'gumbel'},
              {label: 'Conditionally Essential (resampling)', value: 'resampling'},
            ]}
          />
        </Row>

        <Row>
          <Selector
            label="Protocol"
            value={form.protocol}
            onChange={val => dispatch({field: 'protocol', val})}
            width="300px"
            options={[
              {label: 'sassetti', value: 'sassetti'},
              {label: 'tn5', value: 'tn5'},
              {label: 'mme1', value: 'mme1'},
            ]}
          />
        </Row>

        <Row>
          <Selector
            label="Trimming"
            value={form.primer_trimming}
            onChange={val => dispatch({field: 'primer_trimming', val})}
            width="300px"
            options={[
              {label: 'Default', value: 'Default'},
              {label: 'Custom', value: 'Custom'},
              {label: 'None', value: 'None'},
            ]}
          />
        </Row>

        <Row>
          <GenomeSelector
            label="Taget Genome"
            onChange={({genome_id}) => dispatch({field: 'reference_genome_id', val:genome_id})}
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
        title="Tn-Seq Analysis"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Tn-Seq Analysis Service facilitates determination of essential and conditionally essential regions in bacterial genomes from data generated from transposon insertion sequencing (Tn-Seq) experiments.
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
