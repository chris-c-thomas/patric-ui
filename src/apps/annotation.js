import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Grid } from '@material-ui/core';

import { AppHeader, SubmitBtns } from './partials';
import ObjectSelector from './components/object-selector/object-selector';
import Selector from './components/selector';
import TextInput from './components/text-input';
import TaxonNameInput from './components/taxon-name';
import TaxonIDInput from './components/taxon-id';
import Step from '@material-ui/core/Step';
import StepIcon from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';

import './apps.scss';

// auth is required
import { isSignedIn } from '../api/auth';
import SignInForm from '../auth/sign-in-form';

import config from '../config.js'
const userGuideURL =  `${config.docsURL}/user_guides/services/genome_annotation_service.html`;
const tutorialURL = `${config.docsURL}/tutorial/genome_annotation/annotation.html`;

import { getUser } from '../api/auth'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4, 30),
    padding: theme.spacing(3, 2),
  },
  progress: {
    margin: theme.spacing(2),
  }
}));

const example = {
  contigs: '/PATRIC@patricbrc.org/PATRIC Workshop/Annotation/Staphylococcus_aureus_VB4283.fna',
  domain: 'Bacteria',
  scientific_name: 'Staphylococcus auresus',
  tax_id: 1280,
  code: 11,
  output_path: `/${getUser()}@patricbrc.org/home`,
  output_file: 'example',
  recipe: 'default'
}


export default function Annotation() {
  const styles = useStyles();

  const [contigs, setContigs] = useState(null);
  const [domain, setDomain] = useState('Bacteria');
  const [taxName, setTaxName] = useState(null);
  const [taxID, setTaxID] = useState(null);
  const [genCode, setGencode] = useState(11);
  const [recipe, setRecipe] = useState('default');
  const [folder, setFolder] = useState(null);
  const [fileName, setFileName] = useState(null);


  const [filePrefix, setFilePrefix] = useState('')


  function useExample() {
    const obj = example;
    setContigs(obj.contigs);
    setDomain(obj.contigs);
    setTaxName(obj.scientific_name);
    setTaxID(obj.tax_id);
    setGencode(obj.code);
    setRecipe(obj.recipe);
    setFolder(obj.output_path);
    setFileName(obj.output_file);
  }

  function onSubmit() {

  }

  function onReset() {

  }

  let serviceForm = (
    <>
      <Step active={true} completed={contigs && domain && genCode && recipe}>
        <StepIcon icon={1} />
        <StepLabel>Set Parameters</StepLabel>
      </Step>

      <Grid container className="app-section">
        <Grid item xs={12}>
          <ObjectSelector
            placeholder="Select a contigs file..."
            label="Contigs"
            type="contigs"
            value={contigs}
            onChange={val => setContigs(val)}
            dialogTitle="Select a contigs file"
          />
        </Grid>

        <Grid item>
          <Selector
            label="Domain"
            value={domain}
            onChange={val => setDomain(val)}
            options={[
              {value: 'Bacteria', label: 'Bacteria'},
              {value: 'Archea', label: 'Archea'},
              {value: 'Viruses', label: 'Viruses'}
            ]}
          />
        </Grid>

        <Grid container item spacing={1} xs={12} >
          <Grid item xs={8}>
            {/*
            <TaxonNameInput
              value={taxName}
              placeholder="e.g. Brucella Cereus"
              noQueryText="Type to search for a taxonomy name..."
              onChange={({taxon_name}) => setFilePrefix(taxon_name)}
            />
            */}
          </Grid>

          <Grid item xs={4}>
            {/*
            <TaxonIDInput
              placeholder=""
              noQueryText="Type to search by taxonomy ID..."
            />
            */}
          </Grid>
        </Grid>

        <Grid container item xs={12}>
          <Selector
            label="Genetic Code"
            value={genCode}
            onChange={val => setGencode(val)}
            options={[
              {value: '11', label: '11 (Archaea & most bacteria)'},
              {value: '4', label: '4 (Mycoplasma, Spiroplasma & Ureaplasma)'},
              {value: '25', label: '25 (Candidate Divsion SR1 & Gracilibacteria)'},
            ]}
          />
        </Grid>

        <Grid container item xs={12}>
          <Selector
            label="Annotation Recipe"
            value={recipe}
            onChange={val => setRecipe(val)}
            width="200px"
            options={[
              {value: 'default', label: 'Default'},
              {value: 'phage', label: 'Phage'},
            ]}
          />
        </Grid>
      </Grid>

      <Step active={true} completed={false}>
        <StepIcon icon={2} />
        <StepLabel>Select Output</StepLabel>
      </Step>

      <Grid container className="app-section">
        <Grid container item xs={12}>
          <ObjectSelector
            value={folder}
            placeholder="Select a folder..."
            label="Output Folder"
            type="Folder"
            dialogTitle="Select a folder"
          />
        </Grid>

        <Grid item xs={6}>
          <TextInput
            value={fileName}
            label="Output Name"
            adornment={filePrefix}
          />
        </Grid>

        <SubmitBtns
          onSubmit={onSubmit}
          onReset={onReset}
        />
      </Grid>
    </>
  )

  return (
    <Paper className={styles.root}>
      <AppHeader
        title="Genome Annotation"
        onUseExample={useExample}
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

    </Paper>
  )
};
