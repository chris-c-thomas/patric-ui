import React, { useReducer } from 'react';

import { Root, Section, Row } from './FormLayout'

import ObjectSelector from './components/object-selector/ObjectSelector'
import Selector from './components/selector'
import TextInput from './components/TextInput'
import TaxonSelector from './components/TaxonSelector'

import Step from './components/Step'

import { AppHeader, SubmitBtns } from './partials'

// auth is required
import { isSignedIn, getUser } from '../api/auth'
import SignInForm from '../auth/sign-in-form'
import config from '../config.js'

const userGuideURL =  `${config.docsURL}/user_guides/services/genome_annotation_service.html`
const tutorialURL = `${config.docsURL}/tutorial/genome_annotation/annotation.html`


const example = {
  contigs: '/PATRIC@patricbrc.org/PATRIC Workshop/Annotation/Staphylococcus_aureus_VB4283.fna',
  domain: 'Bacteria',
  scientific_name: 'Staphylococcus aureus',
  tax_id: 1280,
  code: 11,
  output_path: `/${getUser(true)}/home`,
  output_file: 'example',
  recipe: 'default'
}

const initialState = {
  contigs: null,
  domain: 'Bacteria',
  scientific_name: null,
  tax_id: null,
  code: 11,
  output_path: null,
  output_file: null,
  recipe: 'default'
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

export default function Annotation() {
  const [form, dispatch] = useReducer(reducer, initialState)

  const onSubmit = () => {
    alert(JSON.stringify(form, null, 4))
  }

  const serviceForm = (
    <>
      <Step number="1" label="Set Parameters"
        completed={form.contigs && form.domain && form.genCode && form.recipe} />

      <Section column padRows>
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
            taxonId={form.tax_id}
            namePlaceholder="e.g. Brucella Cereus"
            onNameChange={({taxon_name}) => dispatch({field: 'scientific_name', val: taxon_name})}
            onIdChange={({taxon_id}) => dispatch({field: 'tax_id', val: taxon_id})}
          />
        </Row>

        <Row>
          <Selector
            label="Genetic Code"
            value={form.code}
            onChange={val => dispatch({field: 'code', val})}
            width="200px"
            options={[
              {value: '11', label: '11 (Archaea & most bacteria)'},
              {value: '4', label: '4 (Mycoplasma, Spiroplasma & Ureaplasma)'},
              {value: '25', label: '25 (Candidate Divsion SR1 & Gracilibacteria)'},
            ]}
          />
        </Row>

        <Row>
          <Selector
            label="Annotation Recipe"
            width="200px"
            value={form.recipe}
            onChange={val => dispatch({field: 'recipe', val})}
            options={[
              {value: 'default', label: 'Bacteria/Archaea'},
              {value: 'phage', label: 'Bacteriophage'},
            ]}
          />
        </Row>
      </Section>

      <Step number="2" label="Select Output" completed={false} />

      <Section column padRows>
        <Row>
          <ObjectSelector
            value={form.output_path}
            placeholder="Select a folder..."
            label="Output Folder"
            type="Folder"
            dialogTitle="Select a folder"
          />
        </Row>

        <Row>
          <TextInput
            value={form.output_file}
            onChange={val => dispatch({field: 'output_file', val})}
            label="Output Name"
            adornment={form.filePrefix}
            width="200px"
          />
        </Row>
      </Section>


      <Section>
        <SubmitBtns
          disabled={!(form.contigs && form.output_file)}
          onSubmit={onSubmit}
          onReset={() => dispatch('RESET')}
        />
      </Section>
    </>
  )

  return (
    <Root small>
      <AppHeader
        title="Genome Annotation"
        onUseExample={() => dispatch('EXAMPLE')}
        description={
          <>
            The Genome Annotation Service uses the RAST tool kit (RASTtk) to provide annotation of genomic features.
            For further explanation, please see the Genome Annotation <a href={userGuideURL} target="_blank">User Guide</a> and <a href={tutorialURL} target="_blank">Tutorial</a>.
          </>
        }
        userGuideURL={userGuideURL}
      />

      <br/>
      {isSignedIn() ? serviceForm : <SignInForm forApp />}
    </Root>
  )
}