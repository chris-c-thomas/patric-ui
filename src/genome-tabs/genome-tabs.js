import React from "react";
import { Link, useParams} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { ActionBar } from './action-bar';
import Overview from './overview';
import { Genomes } from './genomes/genomes';
import { PFContainer } from './protein-families/protein-families';

import NotFound404 from '../404';

const useStyles = makeStyles(theme => ({
  root: {
  },
  card: {
    minWidth: 275,
    margin: '10px'
  },
  tabs: {
    background: 'rgba(0, 0, 0, 0.03)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.125)',
  }
}));


const tabs = [{
  label: 'Overview',
  view: 'overview'
}, {
  label: 'Phylogeny',
  view: 'phylogeny'
}, {
  label: 'Genomes',
  view: 'genomes'
}, {
  label: 'Protein Families',
  view: 'protein-families'
}, {
  label: 'AMR Phenotypes',
  view: 'amr-phenotypes'
}, {
  label: 'Sequences',
  view: 'sequences'
}, {
  label: 'Features',
  view: 'features'
}, {
  label: 'Specialty Genes',
  view: 'spec-genes'
}, {
  label: 'Pathways',
  view: 'pathways'
}, {
  label: 'Subsystems',
  view: 'subsystems'
}, {
  label: 'Transcriptomics',
  view: 'transcriptomics'
}, {
  label: 'Interactions',
  view: 'interactions'
}]

const TabButtons = () => {
  return tabs.map((tab, i) => {
    const {label, view} = tab;
    return (
      <Tab key={i}
        disableRipple
        component={Link}
        label={label}
        value={view}
        to={view}
      />
    )
  })
}

const placeHolder = (view) => <div>{view} goes here</div>;

export default function GenomeTabs(props) {
  const styles = useStyles();
  const {view} = useParams();

  return (
    <>
      <ActionBar />

      <Paper className={styles.card}>
        <>
          <Tabs
            value={view}
            variant="scrollable"
            scrollButtons="auto"
            className={styles.tabs}
          >
            {TabButtons()}
          </Tabs>
        </>
      </Paper>

      {view == tabs[0].view && <Overview />}
      {view == tabs[1].view && placeHolder(view)}
      {view == tabs[2].view && <Genomes />}
      {view == tabs[3].view && <PFContainer />}
      {view == tabs[4].view && placeHolder(view)}
      {view == tabs[5].view && placeHolder(view)}
      {view == tabs[6].view && placeHolder(view)}
      {view == tabs[7].view && placeHolder(view)}
      {view == tabs[8].view && placeHolder(view)}
      {view == tabs[9].view && placeHolder(view)}
      {view == tabs[10].view && placeHolder(view)}
      {view == tabs[11].view && placeHolder(view)}
      {
        tabs.map(obj => obj.view).indexOf(view) == -1 &&
        <NotFound404 />
      }

    </>
  )
}