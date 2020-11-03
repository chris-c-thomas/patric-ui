import React, {useState, useEffect, useCallback} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import styled from 'styled-components'

import WSSidebar, {sidebarWidth} from './WSSidebar'
import FileList from './FileList'
import ActionBar from './WSActionBar'

import Progress from '@material-ui/core/LinearProgress'
import ErrorMsg from '../ErrorMsg'

import * as WS from '../api/ws-api'

import './workspaces.scss'
import GenericViewer from './viewers/GenericViewer'


type Props = {
  isJobResult?: boolean

  // all of these options are for the object selector
  isObjectSelector?: boolean
  fileType?: string
  path?: string
  onSelect?: (obj: object) => void
}


export default function Workspaces(props: Props) {
  const {
    isJobResult,
    isObjectSelector,
    fileType,
    onSelect
  } = props

  const history = useHistory()
  const paramPath = useParams().path

  const [path, setPath] = useState(props.path || decodeURIComponent('/' + paramPath))
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  const [isFolder, setIsFolder] = useState(true)
  const [selected, setSelected] = useState([])


  // listen for path changes for object selector
  useEffect(() => {
    if (!props.path) return
    setPath(props.path)
  }, [props.path])


  // listen for path changes for workspace browser
  useEffect(() => {
    if (!paramPath) return
    setPath('/' + paramPath)
  }, [paramPath])


  // update rows displayed to user
  const updateList = useCallback(() => {
    (async function () {
      setRows(null)
      setLoading(true)

      try {
        // determine if folder or not
        let isFolder = true
        if (path.split('/').length > 2) {
          isFolder = await WS.isFolder(path)
          setIsFolder(isFolder)
        }

        // if job result, fetch data from dot folder instead
        let jobDir
        if (isJobResult) {
          const parts = path.split('/')
          const name = parts.pop()
          jobDir = `${parts.join('/')}/.${name}`
        }

        // get rows
        const data = await WS.list({path: jobDir ? jobDir : path})
        setRows(data)

        // remove actions after list refresh
        setSelected([])
      } catch (err) {
        setError(err)
      }

      setLoading(false)
    })()
  }, [path, isJobResult])


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


  // for object selector
  const onNavigateBreadcrumbs = (evt, path) => {
    if (!isObjectSelector) return

    evt.preventDefault()
    evt.stopPropagation()

    setPath(path)
  }


  // onNavigate deals with double click events and object selector navigation
  const onNavigate = (evt, obj) => {
    if (isObjectSelector) {
      evt.preventDefault()
      evt.stopPropagation()

      setPath(obj.path)
      return
    }

    if (obj.type == 'job_result') {
      history.push(`/job-result${obj.encodedPath}`)
      return
    }

    history.push(`/files${obj.encodedPath}`)
  }

  return (
    <Root isObjectSelector={isObjectSelector}>
      <WSSidebar
        path={path}
        isObjectSelector={isObjectSelector}
        onNavigate={onNavigate}
      />

      <Main>
        <ActionBarContainer>
          <ActionBar
            path={path}
            selected={selected}
            onUpdateList={() => updateList()}
            isObjectSelector={isObjectSelector}
            onNavigateBreadcrumbs={onNavigateBreadcrumbs}
          />

          {isJobResult &&
            <h3>Job Result</h3>
          }

        </ActionBarContainer>

        <FileListContainer>
          {loading && <Progress className="card-progress" /> }

          {isFolder ?
            <FileList
              rows={rows}
              onSelect={handleSelect}
              onNavigate={onNavigate}
              isObjectSelector={isObjectSelector}
              fileType={fileType}
            /> :
            <GenericViewer path={path} />
          }

          {error && <ErrorMsg error={error} />}
        </FileListContainer>
      </Main>

    </Root>
  )
}


const Root = styled.div`
  display: flex;
  max-height: calc(100% - ${p => p.isObjectSelector ? `${32 * 2 + 64 + 120}px` : '55px'});
  height: 100%;
  padding: 4px 5px 5px 0;
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


