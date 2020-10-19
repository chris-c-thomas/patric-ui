import React, {useState, useEffect, useCallback} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import styled from 'styled-components'

import Sidebar, {sidebarWidth} from './WSSidebar'
import FileList from './FileList'
import ActionBar from './WSActionBar'
import ErrorMsg from '../ErrorMsg'

import * as WS from '../api/ws-api'

import './workspaces.scss'
import GenericViewer from './viewers/GenericViewer'


type Props = {
  // all of these options are for the object selector
  isObjectSelector?: boolean
  fileType?: string
  path?: string
  onSelect?: (obj: object) => void
}


export default function Workspaces(props: Props) {
  const {isObjectSelector, onSelect, fileType} = props

  let path = decodeURIComponent('/' + useParams().path)

  if (props.path) {
    path = props.path
  }

  const history = useHistory()

  const [isObject, setIsObject] = useState(null)
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  const [selected, setSelected] = useState([])


  const updateList = useCallback(() => {
    setRows(null)

    WS.isFolder(path)
      .then(isFolder => setIsObject(!isFolder)).catch(err => {
        console.log('err',err)
        setError(err)
      })


    WS.list({path})
      .then(data => {
        setRows(data)

        // remove actions after list refresh
        setSelected([])
      }).catch(err => {
        console.log('err',err)
        setError(err)
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

    if (onSelect)
      onSelect(state.objs)
  }

  const onNavigate = (obj) => {
    if (obj.type == 'job_result') {
      history.push(`/job-result${obj.encodedPath}`)
      return
    }

    history.push(`/files${obj.encodedPath}`)
  }

  return (
    <Root>

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
            isObjectSelector={isObjectSelector}
          />
        </ActionBarContainer>

        <FileListContainer>
          {isObject ?
            <GenericViewer path={path} /> :
            <FileList
              rows={rows}
              onSelect={handleSelect}
              onNavigate={onNavigate}
              isObjectSelector={isObjectSelector}
              fileType={fileType}
            />
          }

          {error && <ErrorMsg error={error} />}
        </FileListContainer>
      </Main>

    </Root>
  )
}


const Root = styled.div`
  display: flex;
  max-height: calc(100% - 55px);
  height: 100%;
  padding: 5px 5px 5px 0;
  background: #fff;
`

const Main = styled.div`
  position: relative;
  width: calc(100% - ${sidebarWidth});
`

const ActionBarContainer = styled.div`
  padding: 15px 10px;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
`

const FileListContainer = styled.div`
  padding: 0 5px;
`


