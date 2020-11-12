import React, { useState, useReducer } from 'react'

import { isSignedIn, getUser } from '../api/auth'
import SignInForm from '../auth/SignInForm'
import { submitApp } from '../api/app-service'
import config from '../config'

import { Root, Section, Row } from './common/FormLayout'
import AppHeader from './common/AppHeader'
import SubmitBtns from './common/SubmitBtns'
import AppStatus from './common/AppStatus'

import Step from './components/Step'
import GenomeTableSelector from './components/GenomeTableSelector'
import ObjectSelector from './components/object-selector/ObjectSelector'
import WSFileName from './components/WSFileName'
import TextInput from './components/TextInput'


import Selector from './components/Selector'

const appName = 'CodonTree'
const userGuideURL = `${config.docsURL}/user_guides/services/phylogenetic_tree_building_service.html`
const tutorialURL = `${config.docsURL}/tutorial/codon_tree_building/codon_tree_building.html`


const example = {
  bootstraps: '100',
  optional_genome_ids: [],
  genome_ids: [
    '1401651.3', '428411.4', '401619.4', '401619.6', '515618.4', '1719125.3',
    '203907.6', '1505596.4', '1240471.4', '291272.6', '1505597.4', '859654.3',
    '36868.4', '36870.6', '713600.3', '713601.3', '98804.3', '713603.3', '713602.3',
    '372461.17', '118110.3', '655384.3', '1878935.3', '1921549.3', '9.55', '261317.3',
    '224915.9', '1265350.3', '198804.5', '1009858.3', '1009857.3', '118101.4', '107806.10',
    '1005057.4', '1009856.3', '1009859.3', '1005090.4', '561501.4', '563178.4', '1921549.6',
    '2173854.3', '98794.7', '118109.3', '593275.3', '1971639.3'
  ],
  number_of_genes: '50',
  max_genomes_missing: 0,
  max_allowed_dups: 0,
  output_path: `/${getUser(true)}/home`,
  output_file: 'Endosymbiont with suggested removed genomes 50_0_0'
}


const initialState = {
  genome_ids: [],
  number_of_genes: '100',
  max_genomes_missing: 0,
  max_allowed_dups: 0,
  output_path: null,
  output_file: null
}


const reducer = (state, action) => {
  if (action == 'RESET')
    return initialState
  else if (action == 'EXAMPLE')
    return example
  else if (action.type == 'ADD_GENOME')
    return { ...state, genome_ids: [...state.genome_ids, action.val] }
  else if (action.type == 'ADD_GENOME_GROUP')
    return { ...state, genome_ids: [...state.genome_ids, ...action.val] }
  else if (action.type == 'REMOVE_GENOME')
    return { ...state, genome_ids: state.genome_ids.filter((_, i) => i != action.val) }
  else
    return { ...state, [action.field]: action.val }
}


export default function PhylogeneticTree() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const [status, setStatus] = useState(null)


  const onSubmit = () => {
    setStatus('starting')
    submitApp(appName, form)
      .then(() => setStatus('success'))
      .catch(error => setStatus(error))
  }


  const isStep1Complete = () => !!form.genome_ids.length

  const isStep2Complete = () => isStep1Complete()

  const isStep3Complete = () => !!form.output_path  && !!form.output_file


  const isOutOfRange = (field) => form[field] < 0 || form[field] > 10


  const serviceForm = (
    <>
      <Step number="1" label="Select Genomes" completed={isStep1Complete()} />
      <Section column>
        <GenomeTableSelector genomeIDs={form.genome_ids} dispatch={dispatch} />
      </Section>


      <Step number="2" label="Set Parameters" completed={isStep2Complete()} />
      <Section column padRows>
        <Row>
          <Selector
            label="Number of Genes"
            value={form.number_of_genes}
            onChange={val => dispatch({ field: 'number_of_genes', val })}
            width="150px"
            InputLabelProps={{
              shrink: true,
            }}
            options={[
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
              { value: '500', label: '500' },
              { value: '1000', label: '1000' },
            ]}
          />
        </Row>

        <Row>
          <TextInput
            label="Max Allowed Deletions (0-10)"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 10 } }}
            error={isOutOfRange('max_genomes_missing')}
            helperText={isOutOfRange('max_genomes_missing') && 'value must be between 1 and 10'}
            value={form.max_genomes_missing}
            onChange={val => dispatch({ field: 'max_genomes_missing', val })}
            style={{ width: 240 }}
          />
        </Row>

        <Row>
          <TextInput
            label="Max Allowed Duplications (0-10)"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 10 } }}
            error={isOutOfRange('max_allowed_dups')}
            helperText={isOutOfRange('max_allowed_dups') && 'value must be between 1 and 10'}
            value={form.max_allowed_dups}
            onChange={val => dispatch({ field: 'max_allowed_dups', val })}
            style={{ width: 240 }}
          />
        </Row>
      </Section>


      <Step number="3" label="Select Output" completed={isStep3Complete()} />
      <Section column padRows>
        <Row>
          <ObjectSelector
            value={form.output_path}
            onChange={val => dispatch({ field: 'output_path', val })}
            placeholder="Select a folder..."
            label="Output Folder"
            type="folder"
            dialogTitle="Select a folder"
          />
        </Row>

        <WSFileName
          value={form.output_file}
          onChange={val => dispatch({ field: 'output_file', val })}
          label="Output Name"
          placeholder="Output name"
        />
      </Section>


      <SubmitBtns
        disabled={!(isStep1Complete() && isStep2Complete())}
        onSubmit={onSubmit}
        status={status}
        onReset={() => dispatch('RESET')}
      />

      <AppStatus name={appName} status={status} />
    </>
  )

  return (
    <Root small>
      <AppHeader
        title="Phylogenetic Tree"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Phylogenetic Tree Building Service enables construction of custom phylogenetic trees for user-selected genomes.
          </>
        }
        userGuideURL={userGuideURL}
        tutorialURL={tutorialURL}
      />

      <br />
      {isSignedIn() ? serviceForm : <SignInForm type="service" />}
    </Root>
  )
}


