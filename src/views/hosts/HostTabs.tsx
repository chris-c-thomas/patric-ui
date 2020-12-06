import React from 'react'
import { Link, useParams} from 'react-router-dom'

import styled from 'styled-components'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { plainTabsStylesHook } from '@mui-treasury/styles/tabs'

import { TaxonActionBar } from '../TaxonActionBar'
import Genomes from '../taxon/genomes/Genomes'
import Sequences from '../taxon/sequences/Sequences'
import Features from '../taxon/features/Features'

import { TabProvider } from '../TabContext'


import NotFound404 from '../../404'


const tabs = [{
  label: 'Geenomes',
  view: 'genome',
  Component: <Genomes />
}, {
  label: 'Sequences',
  view: 'sequences',
  Component: <Sequences />
}, {
  label: 'Features',
  view: 'features',
  Component: <Features />
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
        <TabProvider>
          {view == tabs[0].view && tabs[0].Component}
          {view == tabs[1].view && tabs[1].Component}
          {view == tabs[2].view && tabs[2].Component}
        </TabProvider>
        {/*view == tabs[3].view && <PFContainer />*/}
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