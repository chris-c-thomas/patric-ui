import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Grid, Step, StepIcon, StepLabel } from '@material-ui/core';
import ReadSelector from './components/read-selector';
import ObjectSelector from './components/object-selector/object-selector';
import Selector from './components/selector';
import TextInput from './components/text-input';
import AdvandedButton from './components/advanced-button';

import { AppHeader, SubmitBtns } from './partials';

import '../styles/apps.scss';

// auth is required
import { isSignedIn } from '../api/auth-api';
import SignInForm from '../auth/sign-in-form';


import config from '../config.js';
const userGuideURL = `${config.docsURL}/user_guides/services/genome_assembly_service.html`;
const tutorialURL = `${config.docsURL}/tutorial/genome_assembly/assembly.html`;


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
  paired_end_libs: [{
      "read1": "/PATRIC@patricbrc.org/PATRIC Workshop/Assembly/SRR3584989_1.fastq",
      "read2": "/PATRIC@patricbrc.org/PATRIC Workshop/Assembly/SRR3584989_2.fastq",
      "interleaved": false,
      "read_orientation_outward": false,
      "platform": "infer",
    }],
  racon_iter: 2,
  pilon_iter: 2,
  recipe: 'auto',
  min_contig_len: 300,
  min_contig_cov: 5,
  trim: false,
  output_path: null,
  output_file: null
}


export default function Assembly() {
  const styles = useStyles();
  const [reads, setReads] = useState([]);

  const [form, setForm] = useState({
    paired_end_libs: [],
    single_end_libs: [],
    srr_ids: [],
    racon_iter: 2,
    pilon_iter: 2,
    recipe: 'auto',
    min_contig_len: 300,
    min_contig_cov: 5,
    trim: false,
    output_path: null,
    output_file: null
  });

  const [advParams, setAdvParams] = useState(false);


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

  const serviceForm = (
    <>
      <Step active={true} completed={reads.length > 0}>
        <StepIcon icon={1} />
        <StepLabel>Select Reads</StepLabel>
      </Step>

      <Grid container className="app-section">
        <Grid item xs={12}>
          <ReadSelector
            reads={reads}
            onChange={onReadsChange}
            advancedOptions
          />
        </Grid>
      </Grid>

      <Step active={true} completed={reads.length > 0}>
        <StepIcon icon={2} />
        <StepLabel>Set Parameters</StepLabel>
      </Step>

      <Grid container className="app-section" spacing={1}>

        <Grid container>
          <Selector
            label="Assembly Strategy"
            value={form.recipe}
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
        </Grid>

        <AdvandedButton onClick={open => setAdvParams(open)} />

        {advParams &&
          <>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <TextInput
                  label="RACON Interations"
                  type="number"
                  value={form.racon_iter}
                    />
              </Grid>

              <Grid item xs={3}>
                <TextInput
                  label="Pilon Interations"
                  type="number"
                  value={form.pilon_iter}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={3}>
                <TextInput
                  type="number"
                  label="Min. Contig Length"
                  value={form.min_contig_cov}
                />
              </Grid>

              <Grid item xs={3}>
                <TextInput
                  label="Min. Contig Coverage"
                  type="number"
                  value={form.minContigCoverage}
                />
              </Grid>
            </Grid>
          </>
        }
      </Grid>

      <br/>

      <Step active={true} completed={false}>
        <StepIcon icon={3} />
        <StepLabel>Select Output</StepLabel>
      </Step>

      <Grid container className="app-section">
        <Grid container item xs={12}>
          <ObjectSelector
            value={form.output_path}
            placeholder="Select a folder..."
            label="Output Folder"
            type="Folder"
            dialogTitle="Select a folder"
          />
        </Grid>

        <Grid item xs={6}>
          <TextInput
            value={form.output_file}
            label="Output Name"
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
        title="Genome Assembly"
        onUseExample={useExample}
        description={
          <>
            This service allows single or multiple assemblers to be invoked to compare results.
            The service attempts to select the best assembly. For further explanation, please see
            the <a href={userGuideURL} target="_blank">User Guide</a> and <a href={tutorialURL} target="_blank">Tutorial</a>.
          </>
        }
        userGuideURL={userGuideURL}
      />

      <br/>

      {isSignedIn() ? serviceForm : <SignInForm forApp />}
    </Paper>
  )
};
