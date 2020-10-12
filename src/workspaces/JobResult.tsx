import React, {useState, useEffect, useCallback} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import styled from 'styled-components'

import Sidebar, {sidebarWidth} from './WSSidebar'
import FileList from './FileList'
import ActionBar from './WSActionBar'

import * as WS from '../api/ws-api'

import './workspaces.scss'


type Props = {
  isObjectSelector?: boolean
  path?: string // for object selector
}


export default function Workspaces(props: Props) {
  let path = decodeURIComponent('/' + useParams().path)

  if (props.path) {
    path = props.path
  }

  const history = useHistory()

  const [rows, setRows] = useState(null)
  const [selected, setSelected] = useState([])

  const updateList = useCallback(() => {
    if (!path) return

    const parts = path.split('/')
    const name = parts.pop()
    const jobDir = `${parts.join('/')}/.${name}`

    setRows(null)
    WS.list({path: jobDir, includeHidden: true})
      .then(data => {
        console.log('fetched workspace data:', data)
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

        <Sidebar
          selected={selected}
          {...props}
        />

        <Main>
          <ActionBarContainer>
            <ActionBar
              path={path}
              selected={selected}
              onUpdateList={() => updateList()}
              isJobResult
            />

            <h3>Job Result</h3>
          </ActionBarContainer>

          <FileListContainer>
            <FileList
              rows={rows}
              onSelect={handleSelect}
              onNavigate={onNavigate}
              isObjectSelector={props.isObjectSelector}
              isJobResult
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
  padding: 5px 5px 5px 0;
  background: #fff;
`

const ActionBarContainer = styled.div`
  padding: 15px 10px;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
`

const FileListContainer = styled.div`
  padding: 0 5px;
`


