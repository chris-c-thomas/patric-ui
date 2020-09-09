import React, {useState, useEffect, useCallback} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import styled from 'styled-components'

import Sidebar, {sidebarWidth} from './Sidebar'

/*
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

import Public from '@material-ui/icons/PublicRounded'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import FolderFav from '@material-ui/icons/FolderSpecialRounded'
*/

import FileList from './FileList'
import ActionBar from './ActionBar'

import * as WS from '../api/ws-api'

import './workspaces.scss'


export default function Workspaces() {
  const path = decodeURIComponent('/' + useParams().path)
  const history = useHistory()

  const [rows, setRows] = useState(null)
  const [selected, setSelected] = useState([])

  const updateList = useCallback(() => {
    setRows(null)
    WS.list({path})
      .then(data => {
        console.log('data', data)
        setRows(data)

        // remove actions after list refresh
        setSelected([])
      })
  }, [path])

  // update workspace list whenever path changes
  useEffect(() => {
    updateList()
  }, [path, updateList])

  // remove actions on path change
  useEffect(() => {
    setSelected([])
  }, [path])


  const handleSelect = (state) => {
    setSelected(state.objs)
  }

  const onNavigate = (obj) => {
    history.push(`/files${obj.encodedPath}`)
  }

  return (
    <Root>
      <Container>

        <Sidebar onChange={() => {}}/>

        <Main>
          <ActionBarContainer>
            <ActionBar
              path={path}
              selected={selected}
              onUpdateList={() => updateList()}
            />
          </ActionBarContainer>

          <FileListContainer>
            <FileList
              rows={rows}
              onSelect={handleSelect}
              onNavigate={onNavigate}
            />
          </FileListContainer>
        </Main>
      </Container>
    </Root>
  )
}


const Root = styled.div`

`

const Main = styled.div`
  width: calc(100% - ${sidebarWidth});
`

const Container = styled.div`
  display: flex;
  height: calc(100% - 60px);
  padding: 5px;
  background: #fff;
`

const ActionBarContainer = styled.div`
  padding: 15px 10px;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
`

const FileListContainer = styled.div`
  padding: 0 5px;
`


