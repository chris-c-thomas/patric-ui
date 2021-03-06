import React, {useContext} from 'react'
import { Link, useParams} from 'react-router-dom'

import styled from 'styled-components'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { plainTabsStylesHook } from '@mui-treasury/styles/tabs'

import { TaxonActionBar } from '../TaxonActionBar'

import Overview from './Overview'
import Phylogeny from '../viewers/PhylogeneticTree'
import Genomes from './genomes/Genomes'
import AMRPhenotypes from './amr/AMRPhenotypes'
import Sequences from './sequences/Sequences'
import Features from './features/Features'
import SpecialtyGenes from './specialty-genes/SpecGenes'
import Pathways from './pathways/Pathways'
import Subsystems from './subsystems/Subsystems'

import NotFound404 from '../../404'

import { TabProvider } from '../TabContext'

const tabs = [{
  label: 'Overview',
  view: 'overview',
  Component: <Overview />
}, {
  label: 'Phylogeny',
  view: 'phylogeny',
  Component: <Phylogeny />
}, {
  label: 'Genomes',
  view: 'genomes',
  Component: <Genomes />
}, {
  label: 'AMR Phenotypes',
  view: 'amr',
  Component: <AMRPhenotypes />
}, {
  label: 'Sequences',
  view: 'sequences',
  Component: <Sequences />
}, {
  label: 'Features',
  view: 'features',
  Component: <Features />
}, {
  label: 'Specialty Genes',
  view: 'specialtyGenes',
  Component: <SpecialtyGenes />
}, {
  label: 'Pathways',
  view: 'pathways',
  Component: <Pathways />
}, {
  label: 'Subsystems',
  view: 'subsystems',
  Component: <Subsystems />
}, {
  label: 'Transcriptomics',
  view: 'transcriptomics'
}, {
  label: 'Interactions',
  view: 'interactions'
}]

/*{
  label: 'Protein Families',
  view: 'protein-families'
}*/

const TabButtons = () => {
  const tabItemStyles = plainTabsStylesHook.useTabItem()

  return tabs.map((tab, i) => {
    const {label, view} = tab
    return (
      <Tab key={i}
        disableRipple
        classes={tabItemStyles}
        component={Link}
        label={label}
        value={view}
        to={view}
      />
    )
  })
}

const placeHolder = (view) => <div>{view} goes here</div>


export default function GenomeTabs() {
  const {view} = useParams()


  return (
    <Root>
      <TaxonActionBar title="Taxon View"/>

      <Tabs
        value={view}
        variant="scrollable"
        scrollButtons="auto"
      >
        {TabButtons()}
      </Tabs>

      <Content>
        <TabProvider>
          {view == tabs[0].view && tabs[0].Component}
          {view == tabs[1].view && tabs[1].Component}
          {view == tabs[2].view && tabs[2].Component}
          {view == tabs[3].view && tabs[3].Component}
          {view == tabs[4].view && tabs[4].Component}
          {view == tabs[5].view && tabs[5].Component}
          {view == tabs[6].view && tabs[6].Component}
          {view == tabs[7].view && tabs[7].Component}
          {view == tabs[8].view && tabs[8].Component}
          {view == tabs[9].view && placeHolder(view)}
          {view == tabs[10].view && placeHolder(view)}
        </TabProvider>
        {
          tabs.map(obj => obj.view).indexOf(view) == -1 &&
          <NotFound404 />
        }
      </Content>

    </Root>
  )
}

const Root = styled.div`
  background: #fff;
`
const Content = styled.div`
  border-top: 1px solid #e9e9e9;
  margin-top: -1px;
  background: #fff;
`