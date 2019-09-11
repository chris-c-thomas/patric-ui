import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Grid } from '@material-ui/core';
import ReadSelector from './components/read-selector';

import ObjectSelector from './components/object-selector/object-selector';
import TextInput from './components/text-input'

import { Step, StepIcon, StepLabel } from '@material-ui/core';

import { AppHeader, SubmitBtns } from './partials';

import '../styles/apps.scss';

import config from '../config.js';
const userGuideURL = `${config.docsURL}/tutorial/genome_assembly/assembly.html`;
const tutorialURL = `${config.docsURL}/user_guides/services/genome_assembly_service.html`;


import { user } from '../../token.js'

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

}


export default function Assembly() {
  const styles = useStyles();

  const [reads, setReads] = useState([]);
  const [folder, setFolder] = useState(null);
  const [fileName, setFileName] = useState(null);

  const [filePrefix, setFilePrefix] = useState('')


  function useExample() {
    const obj = example;
  }

  function onSubmit() {

  }

  function onReset() {

  }

  function onReadsChange(reads) {
    setReads(reads)
  }

  return (
    <Paper className={styles.root}>
      <AppHeader
        title="Genome Assembly"
        onUseExample={useExample}
        description={
          <>
            This service allows single or multiple assemblers to be invoked to compare results.
            The service attempts to select the best assembly. For further explanation, please see the
            <a href={userGuideURL}>User Guide</a> and <a href={tutorialURL}>Tutorial</a>.
          </>
        }
      />

      <br/>

      <Step active={true} completed={reads.length > 0}>
        <StepIcon icon={1} />
        <StepLabel>Select Reads</StepLabel>
      </Step>

      <Grid container className="app-section">
        <Grid item xs={12}>
          <ReadSelector
            onChange={onReadsChange}
          />
        </Grid>
      </Grid>

      <Step active={true} completed={false}>
        <StepIcon icon={2} />
        <StepLabel>Set Parameters</StepLabel>
      </Step>
      <br/>


      <Step active={true} completed={false}>
        <StepIcon icon={3} />
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
    </Paper>
  )
};
