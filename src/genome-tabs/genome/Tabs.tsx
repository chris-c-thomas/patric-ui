import React from 'react'
import { Link, useParams} from 'react-router-dom'

import styled from 'styled-components'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { plainTabsStylesHook } from '@mui-treasury/styles/tabs'

import { TaxonActionBar } from '../TaxonActionBar'
import Overview from './GenomeOverview'
import Phylogeny from '../Phylogeny'

// import { PFContainer } from './protein-families/protein-families'


import NotFound404 from '../../404'


const tabs = [{
  label: 'Overview',
  view: 'overview',
}, {
  label: 'AMR Phenotypes',
  view: 'amr'
}, {
  label: 'Phylogeny',
  view: 'phylogeny'
}, {
  label: 'Genome Browser',
  view: 'genome-browser'
}, {
  label: 'Circular Viewer',
  view: 'circular-viewer'
},{
  label: 'Sequences',
  view: 'sequences'
},{
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
        {view == tabs[0].view && <Overview />}
        {view == tabs[1].view && placeHolder(view)}
        {view == tabs[2].view && <Phylogeny />}
        {/*view == tabs[3].view && <PFContainer />*/}
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