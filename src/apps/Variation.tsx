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

const appName = 'Variation'
const userGuideURL = `${config.docsURL}/user_guides/services/genome_assembly_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_assembly/assembly.html`


const example = {
  paired_end_libs: [{
    read1: '/PATRIC@patricbrc.org/PATRIC Workshop/Variation/Mycobacterium_leprae_example/SK2_SRR847034_1.fastq.gz',
    read2: '/PATRIC@patricbrc.org/PATRIC Workshop/Variation/Mycobacterium_leprae_example/SK2_SRR847034_2.fastq.gz',
    interleaved: 'false',
    platform: 'infer',
    read_orientation_outward: 'false'
  }],
  single_end_libs: [],
  srr_ids: [],
  mapper: 'BWA-mem',
  caller: 'FreeBayes',
  reference_genome_id: "272631.5",
  output_path: `/${getUser(true)}/home`,
  output_file: "variation example"
}

const initialState = {
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
  mapper: 'BWA-mem',
  caller: 'FreeBayes',
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


export default function Variation() {
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
            label="Aligner"
            value={form.mapper}
            onChange={val => dispatch({field: 'mapper', val})}
            width="200px"
            options={[
              {label: 'BWA-mem', value: 'BWA-mem'},
              {label: 'BWA-mem-strict', value: 'BWA-mem-strict'},
              {label: 'Bowtie2', value: 'Bowtie2'},
              {label: 'LAST', value: 'LAST'},
            ]}
          />
        </Row>

        <Row>
          <Selector
            label="SNP Caller"
            value={form.caller}
            onChange={val => dispatch({field: 'caller', val})}
            width="200px"
            options={[
              {label: 'FreeBayes', value: 'FreeBayes'},
              {label: 'SAMtools', value: 'SAMtools'},
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
        title="Variation Analysis"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Variation Analysis Service can be used to identify and annotate sequence variations.
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
