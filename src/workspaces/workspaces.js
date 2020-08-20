import React, { useEffect } from 'react'
import styled from 'styled-components'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import Public from '@material-ui/icons/PublicRounded';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FolderIcon from '@material-ui/icons/FolderOutlined';
import FolderFav from '@material-ui/icons/FolderSpecialRounded';

import FileList from './file-list'

import WSBreadCrumbs from '../utils/ui/ws-breadcrumbs'


import './workspaces.scss'

const BreadCrumbs = () =>
  <Grid container>
    <Grid item xs={9}>
      <WSBreadCrumbs/>
    </Grid>
  </Grid>




const Sidebar = (props) => {

  const handleChange = (val) => {
    console.log('val', val)
  }

  return (
    <SidebarRoot>
      <h3>Workspaces</h3>

      <div>
        <Tabs
          orientation="vertical"
          value={0}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Workspaces" disableRipple/>
          <Tab label="Home" disableRipple />
          <Tab label="Genome Groups" disableRipple/>
        </Tabs>
      </div>
    </SidebarRoot>
  )
}

const sidebarWidth = '200px'

const SidebarRoot = styled.div`
  width: ${sidebarWidth};
  padding: 5px 10px;
  border-right: 1px solid #ccc;

  .MuiTab-wrapper {
    display: inline-block;
  }
`

export default function Workspaces() {

  const onSelect = () => {
  }

  return (
    <Root>
      <Card>
        <Sidebar />

        <Main>

          <BreadCrumbContainer>
            <BreadCrumbs />
          </BreadCrumbContainer>

          <FileListContainer>
            <FileList
              onSelect={onSelect}
              noBreadCrumbs={true}
            />
          </FileListContainer>
        </Main>

      </Card>
    </Root>
  )
}

const Root = styled.div`
  .main-container {
    display: flex;
  }
`

const Main = styled.div`
  width: calc(100% - ${sidebarWidth});
`

const Card = styled(Paper)`
  display: flex;
  height: calc(100% - 60px);
  margin: 5px;
`

const BreadCrumbContainer = styled.div`
  margin: 5px;
  padding: 20px 10px;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
`

const FileListContainer = styled.div`
`

