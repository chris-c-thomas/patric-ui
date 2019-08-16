import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';

import ObjectSelector from './components/object-selector';
import Selector from './components/selector';

import CircularProgress from '@material-ui/core/CircularProgress';
// import clsx from 'clsx';

import config from '../config.js'
const userGuideURL = `${config.docsURL}/tutorial/genome_annotation/annotation.html`;
const tutorialURL = `${config.docsURL}/user_guides/services/genome_annotation_service.html`;


const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4, 8),
    padding: theme.spacing(3, 2),
  },
  progress: {
    margin: theme.spacing(2),
  },
  p: {
    fontSize: '.9em'
  }
}));


export function Annotate() {
  const styles = useStyles();

  const [values, setValues] = useState({
    domain: 'Bacteria'
  })


  function handleChange(event) {
    setValues(oldVals => ({
      ...oldVals,
      [event.target.name]: event.target.value,
    }));

    console.log('new values', values)
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

      <ObjectSelector label="Select a contig" id="contig" />

      <Selector label="Domain" id="domain" default="Bacteria"
        options={[
          {value: 'Bacteria', label: 'Bacteria'},
          {value: 'Archea', label: 'Archea'},
          {value: 'Viruses', label: 'Viruses'}
        ]}/>

      <Selector label="Genetic Code" id="genetic-code" default="11"
        options={[
          {value: '11', label: '11 (Archaea & most bacteria'},
          {value: '4', label: '4 (Mycoplasma, Spiroplasma & Ureaplasma'},
          {value: '25', label: '25 (Candidate Divsion SR1 & Gracilibacteria'},
        ]}/>

      <Selector label="Annotation Recipe" id="annotation-recipe" default="default"
        options={[
          {value: 'default', label: 'Default'},
          {value: 'phage', label: 'Phage'},
        ]}/>

    </Paper>
  )

};
