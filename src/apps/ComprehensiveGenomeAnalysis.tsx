
// example ids: SRR5121082, ERR3827346, SRX981334
import React, { useState, useReducer } from 'react'

import { Root, Section, Row } from './common/FormLayout'
import AppHeader from './common/AppHeader'
import SubmitBtns from './common/SubmitBtns'
import AppStatus from './common/AppStatus'

import Step from './components/Step'
import ReadSelector from './components/ReadSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/Selector'
import Radio from './components/Radio'
import TaxonSelector from './components/TaxonSelector'
import TextInput from './components/TextInput'
import AdvancedButton from './components/AdvancedButton'
import WSFileName from './components/WSFileName'

// auth is required
import { isSignedIn, getUser} from '../api/auth'
import SignInForm from '../auth/SignInForm'

import { submitApp } from '../api/app-service'

import config from '../config'
const appName = 'ComprehensiveGenomeAnalysis'
const userGuideURL = `${config.docsURL}/user_guides/services/comprehensive_genome_analysis_service.html`
const tutorialURL = `${config.docsURL}/tutorial/comprehensive-genome-analysis/comprehensive-genome-analysis2.html`


const example = {
  genome_size: 5000000,
  debug_level: 0,
  pilon_iter: 2,
  min_contig_cov: 5,
  domain: 'Bacteria',
  input_type: 'reads',
  paired_end_libs: [],
  code: '11',
  min_contig_len: 300,
  reads: [{ // not sent to server
    type: 'srr_ids',
    label: 'SRR1955831',
    value: 'SRR1955831'
  }, {
    type: 'srr_ids',
    label: 'SRR1955832',
    value: 'SRR1955832'
  }, {
    type: 'srr_ids',
    label: 'SRR1955833',
    value: 'SRR1955833'
  }],
  srr_ids: [
    'SRR1955831',
    'SRR1955832',
    'SRR1955833'
  ],
  trim: 'false',
  skip_indexing: '0',
  taxonomy_id: '1280',
  scientific_name: 'Staphylococcus aureus SRR1955831_SRR1955832_SRR1955833',
  racon_iter: 2,
  recipe: 'unicycler',
  output_path: `/${getUser(true)}/home`,
  my_label: 'CGA example',

  // output_file: will end up being `${scientific_name} ${my_label}`
  // scientific_name: will end up being `${scientific_name} ${my_label}`
}


const initialState = {
  input_type: 'reads',
  skip_indexing: true,
  reads: [],  // not sent to server
  paired_end_libs: [],
  single_end_libs: [],
  srr_ids: [],
  recipe: 'auto',
  trim: 'false',
  genome_size: 500000,
  contigs: null,
  domain: 'Bacteria',
  code: '11',
  scientific_name: null,
  taxonomy_id: null,
  racon_iter: 2,
  pilon_iter: 2,
  min_contig_len: 300,
  min_contig_cov: 5,
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
  else if (action.field == 'reads') {
    const {reads} = action
    return {
      ...state,
      paired_end_libs: reads.filter(o => o.type == 'paired_end_libs').map(o => o.value),
      single_end_libs: reads.filter(o => o.type == 'single_end_libs').map(o => o.value),
      srr_ids: reads.filter(o => o.type == 'srr_ids').map(o => o.value),
      reads  // just to make validation easier (see isStep1Complete)
    }
  } else {
    return {...state, [action.field]: action.val}
  }
}

const getValues = (form) => {
  let params = {...form}
  params.scientific_name = `${form.scientific_name} ${form.my_label}`
  params.output_file = `${form.scientific_name} ${form.my_label}`
  delete params.reads
  return params
}


export default function SARSCoV2() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState(null)

  const [advParams, setAdvParams] = useState(false)


  const onSubmit = () => {
    const values = getValues(form)
    setStatus('starting')
    submitApp(appName, values)
      .then(() => setStatus('success'))
      .catch(error => setStatus(error))
  }


  const isReadsComplete = () =>
    (form.input_type == 'reads' && form.reads.length > 0) ||
    (form.input_type == 'contigs' && form.contigs)

  const isAnnotationStepComplete = () =>
    form.recipe && form.taxonomy_id

  const isAssemblyStepComplete = () =>
    isReadsComplete() && form.scientific_name && form.taxonomy_id

  const isOutputComplete = () =>
    form.output_path != null && !!form.my_label


  const serviceForm = (
    <div>
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

      <Step number="1" label="Select Input File(s)" completed={isReadsComplete()} />

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


      {form.input_type == 'reads' &&
        <Step number="2" label="Set Assembly Parameters" completed={isAnnotationStepComplete()} />
      }

      {form.input_type == 'reads' &&
        <Section column padRows>
          <Row>
            <Selector
              label="Assembly Strategy"
              value={form.recipe}
              onChange={val => dispatch({field: 'recipe', val})}
              width="220px"
              options={[
                {label: 'Auto', value: 'auto'},
                {label: 'CDC-Illumina', value: 'unicycler'},
                {label: 'Canu', value: 'canu'},
                {label: 'metaSPAdes', value: 'meta-spades'},
                {label: 'plasmidSPAdes', value: 'plasmid-spades'},
                {label: 'MDA (single-cell)', value: 'single-cell'},
              ]}
            />
          </Row>

          {form.recipe == 'Canu' &&
            <Row>
              <TextInput
                label="Genome Size"
                type="number"
                value={form.genome_size}
                onChange={val => dispatch({field: 'genome_size', val})}
              />
            </Row>
          }

          <Row>
            <Selector
              label="Trim Reads Before Assembly"
              value={form.trim}
              onChange={val => dispatch({field: 'trim', val})}
              width="220px"
              options={[
                {label: 'No', value: 'false'},
                {label: 'Yes', value: 'true'}
              ]}
            />
          </Row>

          <AdvancedButton onClick={open => setAdvParams(open)} />
          {advParams &&
            <div>
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
            </div>
          }
        </Section>
      }


      <Step number={form.input_type == 'contigs' ? 2 : 3} label="Set Annotation Parameters" completed={isAssemblyStepComplete()} />
      <Section column padRows>
        <Row>
          <Selector
            label="Domain"
            value={form.domain}
            onChange={val => dispatch({field: 'domain', val})}
            width="200px"
            options={[
              {value: 'Bacteria', label: 'Bacteria'},
              {value: 'Archea', label: 'Archea'},
              {value: 'Viruses', label: 'Viruses'}
            ]}
          />
        </Row>

        <Row>
          <TaxonSelector
            taxonName={form.scientific_name}
            taxonId={form.taxonomy_id}
            onNameChange={val => dispatch({field: 'scientific_name', val})}
            onIdChange={val => dispatch({field: 'taxonomy_id', val})}
            geneticCode={form.code}
            onGeneticCodeChange={val => dispatch({field: 'code', val})}
          />
        </Row>
      </Section>


      <Step number={form.input_type == 'contigs' ? 3 : 4}  label="Select Output" completed={isOutputComplete()} />

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
        />
      </Section>

      <SubmitBtns
        disabled={
          form.input_type == 'reads' ?
            !(isReadsComplete() && isAssemblyStepComplete() && isAnnotationStepComplete() && isOutputComplete()) :
            !(isReadsComplete() && isAnnotationStepComplete() && isOutputComplete())
        }
        onSubmit={onSubmit}
        onReset={() => dispatch('RESET')}
        status={status}
      />

      <AppStatus name={appName} status={status} />
    </div>
  )


  return (
    <Root>
      <AppHeader
        title="Comprehensive Genome Analysis"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Comprehensive Genome Analysis Service provides a streamlined analysis "meta-service"
            that accepts raw reads and performs a comprehensive analysis including assembly, annotation,
            identification of nearest neighbors, a basic comparative analysis that includes a subsystem summary,
            phylogenetic tree, and the features that distinguish the genome from its nearest neighbors.
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

