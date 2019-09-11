import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Grid, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import ObjectSelector from './components/object-selector/object-selector';
import Selector from './components/selector';
import TextInput from './components/text-input';
import TaxonNameInput from './components/taxon-name';
import TaxonIDInput from './components/taxon-id';
import { Step, StepIcon, StepLabel } from '@material-ui/core';

import '../styles/apps.scss';

import config from '../config.js'
const userGuideURL = `${config.docsURL}/tutorial/genome_annotation/annotation.html`;
const tutorialURL = `${config.docsURL}/user_guides/services/genome_annotation_service.html`;


import { user } from '../../token.js'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4, 30),
    padding: theme.spacing(3, 2),
  },
  progress: {
    margin: theme.spacing(2),
  },
  p: {
    fontSize: '.9em'
  }
}));

const example = {
  contigs: '/PATRIC@patricbrc.org/PATRIC Workshop/Annotation/Staphylococcus_aureus_VB4283.fna',
  domain: 'Bacteria',
  scientific_name: 'Staphylococcus auresus',
  tax_id: 1280,
  code: 11,
  output_path: `/${user}@patricbrc.org/home`,
  output_file: 'example',
  recipe: 'default'
}


export default function Annotate() {
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



  return (
    <Paper className={styles.root}>
      <Grid container spacing={1}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
          <Typography variant="h5" component="h3">
            Genome Annotation
          </Typography>
          </Grid>
          <Grid item>
            <small><a onClick={useExample}>use example</a></small>
          </Grid>
        </Grid>

        <Grid item>
          <Typography className={styles.p}>
            The Genome Annotation Service uses the RAST tool kit (RASTtk) to provide annotation of genomic features.
            For further explanation, please see the Genome Annotation <a href={userGuideURL}>User Guide</a> and <a href={tutorialURL}>Tutorial</a>.
          </Typography>
        </Grid>
      </Grid>
      <br/>

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

        <Grid container spacing={1} justify="space-between" className="submit-bar">
          <Grid item>
            <Button
              onClick={onSubmit}
              variant="contained"
              color="primary"
              className="no-raised"
              disableRipple
              >
              Submit
            </Button>
          </Grid>
          <Grid item>
            <Button disableRipple>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
};
