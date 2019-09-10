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

const exampleParams = {
  contigs: '/PATRIC@patricbrc.org/PATRIC Workshop/Annotation/Staphylococcus_aureus_VB4283.fna',
  taxon_name: 'Staphylococcus auresus',
}


export default function Annotate() {
  const styles = useStyles();

  const [contigs, setContigs] = useState(null)
  const [filePrefix, setFilePrefix] = useState('')


  function useExample() {
    setContigs(exampleParams.contigs);
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


      <Step active={true} completed={false}>
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
            dialogTitle="Select a contigs file"
          />
        </Grid>

        <Grid container item>
          <Selector label="Domain" name="domain" default="Bacteria"
            options={[
              {value: 'Bacteria', label: 'Bacteria'},
              {value: 'Archea', label: 'Archea'},
              {value: 'Viruses', label: 'Viruses'}
            ]}
          />
        </Grid>


        <Grid container item spacing={1} xs={12} alignItems="flex-end" >
          <Grid item xs={8}>
            <TaxonNameInput
              label="TaxonomyName"
              name="tax_name"
              placeholder="e.g. Brucella Cereus"
              noQueryText="Type to search for a taxonomy name..."
              onChange={({taxon_name}) => setFilePrefix(taxon_name)}
              />
          </Grid>
          <Grid item xs={4}>
            <TaxonIDInput
              label="Taxonomy ID"
              name="tax_id"
              placeholder=""
              noQueryText="Type to search by taxonomy ID..."
            />
          </Grid>
        </Grid>


        <Grid container item>
          <Selector label="Genetic Code" name="genetic-code" default="11"
            options={[
              {value: '11', label: '11 (Archaea & most bacteria)'},
              {value: '4', label: '4 (Mycoplasma, Spiroplasma & Ureaplasma)'},
              {value: '25', label: '25 (Candidate Divsion SR1 & Gracilibacteria)'},
            ]}
          />
        </Grid>

        <Grid container item>
          <Selector label="Annotation Recipe" name="annotation-recipe" default="default"
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
            placeholder="Select a folder..."
            label="Output Folder"
            name="output_folder"
            type="Folder"
            dialogTitle="Select a folder"
          />
        </Grid>

        <Grid item xs={6}>
          <TextInput
            label="Output Name"
            name="output_name"
            adornment={filePrefix}
          />
        </Grid>


        <Grid container spacing={1}>
          <Button variant="outlined" disableRipple>
            Reset
          </Button>
          <Button
            onClick={onSubmit}
            variant="outlined"
            color="primary"
            disableRipple
            disabled>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
};
