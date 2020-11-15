import React, { useState, useReducer } from 'react'

import {
  isSignedIn, getUser, SignInForm,
  AppHeader, SubmitBtns, AppStatus,
  submitApp, config, Root, Section, Row, Step
} from './common'

import ReadSelector from './components/ReadSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/Selector'
import TextInput from './components/TextInput'
import AdvancedButton from './components/AdvancedButton'
import WSFileName from './components/WSFileName'

const appName = 'Assembly2'
const userGuideURL = `${config.docsURL}/user_guides/services/genome_assembly_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_assembly/assembly.html`


const example = {
  reads: [{ // not sent to server
    read1: '/PATRIC@patricbrc.org/PATRIC Workshop/Assembly/SRR3584989_1.fastq',
    read2: '/PATRIC@patricbrc.org/PATRIC Workshop/Assembly/SRR3584989_2.fastq',
    type: 'paired_end_libs',
    label: 'SRR3584989_1.fastq, SRR3584989_2.fastq'
  }],
  recipe: 'auto',
  racon_iter: 2,
  pilon_iter: 2,
  min_contig_len: 300,
  min_contig_cov: 5,
  trim: false,
  output_path: `/${getUser(true)}/home`,
  output_file: 'assembly example',
}

const initialState = {
  reads: [],
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
  recipe: 'auto',
  racon_iter: 2,
  pilon_iter: 2,
  min_contig_len: 300,
  min_contig_cov: 5,
  trim: false,
  output_path: null,
  output_file: null
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
      srr_ids: reads.filter(o => o.type == 'srr_ids').map(o => o.value),
      reads   // just for validation
    }
  } else {
    return {...state, [action.field]: action.val}
  }
}


export default function Assembly() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState(null)

  const [advParams, setAdvParams] = useState(false)

  const onSubmit = () => {
    const params = {...form}
    delete params.reads

    setStatus('starting')
    submitApp(appName, params)
      .then(() => setStatus('success'))
      .catch(error => setStatus(error))
  }

  const serviceForm = (
    <>
      <Step number="1" label="Input File(s)" completed={form.reads.length > 0} />

      <Section>
        <ReadSelector
          reads={form.reads}
          onChange={reads => dispatch({field: 'reads', reads})}
          advancedOptions
        />
      </Section>

      <Step number="2" label="Set Parameters" completed={form.reads.length > 0} />

      <Section column>
        <Row>
          <Selector
            label="Assembly Strategy"
            value={form.recipe}
            onChange={val => dispatch({field: 'recipe', val})}
            width="200px"
            options={[
              {label: 'auto', value: 'auto'},
              {label: 'unicycler', value: 'unicycler'},
              {label: 'spades', value: 'spades'},
              {label: 'canu', value: 'canu'},
              {label: 'meta-spades', value: 'meta-spades'},
              {label: 'plasmid-spades', value: 'plasmid-spades'},
              {label: 'single-cell', value: 'single-cell'},
            ]}
          />
        </Row>


        <AdvancedButton onClick={open => setAdvParams(open)} />

        {advParams &&
          <>
            <Row>
              <TextInput
                label="RACON Interations"
                type="number"
                value={form.racon_iter}
                onChange={val => dispatch({field: 'racon_iter', val})}
              />

              <TextInput
                label="Pilon Interations"
                type="number"
                value={form.pilon_iter}
                onChange={val => dispatch({field: 'pilon_iter', val})}
              />
            </Row>

            <Row>
              <TextInput
                type="number"
                label="Min. Contig Length"
                value={form.min_contig_len}
                onChange={val => dispatch({field: 'min_contig_len', val})}
              />
              <TextInput
                label="Min. Contig Coverage"
                type="number"
                value={form.min_contig_cov}
                onChange={val => dispatch({field: 'min_contig_cov', val})}
              />
            </Row>
          </>
        }
      </Section>

      <Step number="3" label="Select Output" completed={!!form.output_path && !!form.output_file} />

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
        disabled={!(form.reads.length > 0 && form.output_path != null && !!form.output_file)}
      />

      <AppStatus name={appName} status={status} />
    </>
  )


  return (
    <Root>
      <AppHeader
        title="Genome Assembly"
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
