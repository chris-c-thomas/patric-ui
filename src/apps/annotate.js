import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import ObjectSelector from './components/object-selector/object-selector';
import Selector from './components/selector';
import TextInput from './components/text-input';
import TaxonNameInput from './components/taxon-name-input';
import TaxonIDInput from './components/taxon-id-input';


import config from '../config.js'
const userGuideURL = `${config.docsURL}/tutorial/genome_annotation/annotation.html`;
const tutorialURL = `${config.docsURL}/user_guides/services/genome_annotation_service.html`;


const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4, 12),
    padding: theme.spacing(3, 2),
  },
  progress: {
    margin: theme.spacing(2),
  },
  p: {
    fontSize: '.9em'
  }
}));


export default function Annotate() {
  const styles = useStyles();

  function handleFileName(text) {
    return 'taxname+';
  }


  return (
    <Paper className={styles.root}>
      <Typography variant="h5" component="h3">
        Genome Annotation
      </Typography>
      <Typography className={styles.p}>
        The Genome Annotation Service uses the RAST tool kit (RASTtk) to provide annotation of genomic features.<br/>
        For further explanation, please see the Genome Annotation <a href={userGuideURL}>User Guide</a> and <a href={tutorialURL}>Tutorial</a>.
      </Typography>

      <br/>

      <ObjectSelector
        placeholder="Select a contig"
        name="contig"
        type="contigs"
        dialogTitle="Select a contig"
      />

      <Selector label="Domain" name="domain" default="Bacteria"
        options={[
          {value: 'Bacteria', label: 'Bacteria'},
          {value: 'Archea', label: 'Archea'},
          {value: 'Viruses', label: 'Viruses'}
        ]}
      />

      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <TaxonNameInput
            label="TaxonomyName"
            name="tax_name"
            placeholder="e.g. Brucella"
            />
        </Grid>
        <Grid item>
          <TaxonIDInput
            label="Taxonomy ID"
            name="tax_id"
            placeholder=""
            />
        </Grid>
      </Grid>

      <Selector label="Genetic Code" name="genetic-code" default="11"
        options={[
          {value: '11', label: '11 (Archaea & most bacteria'},
          {value: '4', label: '4 (Mycoplasma, Spiroplasma & Ureaplasma'},
          {value: '25', label: '25 (Candidate Divsion SR1 & Gracilibacteria'},
        ]}
      />

      <Selector label="Annotation Recipe" name="annotation-recipe" default="default"
        options={[
          {value: 'default', label: 'Default'},
          {value: 'phage', label: 'Phage'},
        ]}
      />

      <Typography variant="h6" component="h3">Output</Typography><br/>

      <ObjectSelector
        placeholder="Select a folder"
        label="Output Folder"
        name="output_folder"
        type="Folder"
        dialogTitle="Select a folder"
      />

      <TextInput
        label="My Label"
        name="output_name"
        onChange={handleFileName}
      />


    </Paper>
  )

};
