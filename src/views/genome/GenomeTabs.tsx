import React from 'react'
import { Link, useParams} from 'react-router-dom'

import styled from 'styled-components'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { plainTabsStylesHook } from '@mui-treasury/styles/tabs'

import { TaxonActionBar } from '../TaxonActionBar'
import Overview from './GenomeOverview'
import AMRPhenotypes from '../taxon/amr/AMRPhenotypes'
import Phylogeny from '../Phylogeny'
import Sequences from '../taxon/sequences/Sequences'
import Features from '../taxon/features/Features'
import SpecialtyGenes from '../taxon/specialty-genes/SpecGenes'
import Pathways from '../taxon/pathways/Pathways'
import Subsystems from '../taxon/subsystems/Subsystems'

import { TabProvider } from '../TabContext'


import NotFound404 from '../../404'


const tabs = [{
  label: 'Overview',
  view: 'overview',
  Component: <Overview />
}, {
  label: 'AMR Phenotypes',
  view: 'amr',
  Component: <AMRPhenotypes />
}, {
  label: 'Phylogeny',
  view: 'phylogeny',
  Component: <Phylogeny />
}, {
  label: 'Genome Browser',
  view: 'genome-browser'
}, {
  label: 'Circular Viewer',
  view: 'circular-viewer'
},{
  label: 'Sequences',
  view: 'sequences',
  Component: <Sequences />
},{
  label: 'Features',
  view: 'features',
  Component: <Features />
}, {
  label: 'Specialty Genes',
  view: 'spec-genes',
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


const TabButtons = () => {
  const tabItemStyles = plainTabsStylesHook.useTabItem()

  return tabs.map(tab => {
    const {label, view} = tab
    return (
      <Tab key={view}
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

      <TaxonActionBar title="Genome View" />

      <Tabs
        value={view}
        variant="scrollable"
        scrollButtons="auto"
      >
        {TabButtons()}
      </Tabs>

      <Content>
        {view == tabs[0].view && tabs[0].Component}
        {view == tabs[1].view && <TabProvider>{tabs[1].Component}</TabProvider>}
        {view == tabs[2].view && <TabProvider>{tabs[2].Component}</TabProvider>}
        {view == tabs[3].view && <TabProvider>{tabs[3].Component}</TabProvider>}
        {view == tabs[4].view && <TabProvider>{tabs[4].Component}</TabProvider>}
        {view == tabs[5].view && <TabProvider>{tabs[5].Component}</TabProvider>}
        {view == tabs[6].view && <TabProvider>{tabs[6].Component}</TabProvider>}
        {view == tabs[7].view && <TabProvider>{tabs[7].Component}</TabProvider>}
        {view == tabs[8].view && <TabProvider>{tabs[8].Component}</TabProvider>}
        {view == tabs[9].view && <TabProvider>{tabs[9].Component}</TabProvider>}
        {view == tabs[10].view && placeHolder(view)}
        {view == tabs[11].view && placeHolder(view)}
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
`