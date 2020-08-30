import React, {useState} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'

import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

/*
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

import Public from '@material-ui/icons/PublicRounded'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import FolderFav from '@material-ui/icons/FolderSpecialRounded'
*/

import FileList from './FileList'
import BreadCrumbs from './BreadCrumbs'

import './workspaces.scss'

// stuff only for testing
import config from '../config'

const Sidebar = () => {

  const handleChange = (val) => {
    alert('Need to implement')
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
  const path = decodeURIComponent('/' + useParams().path)

  const [selected, setSelected] = useState(null)

  const onSelect = (state) => {
    setSelected(state.objs)
  }

  return (
    <Root>
      <Card>

        <Sidebar />

        <Main>
          <BreadCrumbContainer>
            <BreadCrumbs path={path} selected={selected}/>
          </BreadCrumbContainer>

          <FileListContainer>
            <FileList
              wsPath={path}
              onSelect={onSelect}
            />
          </FileListContainer>
        </Main>
      </Card>

      <P3Link
        href={`${config.p3URL}/workspace/${useParams().path}`}
        target="_blank"
      >
        p3
      </P3Link>
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
  height: calc(100% - 50px);
  margin: 5px;

`
const BreadCrumbContainer = styled.div`
  padding: 20px 10px;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
`

const FileListContainer = styled.div`
  padding: 0 5px;
`

const P3Link = styled.a`
  position: absolute;
  top: 50;
  right: 50;
  opacity: .7;
`

