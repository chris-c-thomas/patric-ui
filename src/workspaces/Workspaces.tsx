import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import styled from 'styled-components'

import WSSidebar, {sidebarWidth} from './WSSidebar'
import WSDetailsSidebar from './WSDetailsSidebar'
import FileList from './FileList'
import WSActionBar from './WSActionBar'
import JobResultOverview from './JobResultOverview'

import useLocalStorage from '../hooks/useLocalStorage'


import Progress from '@material-ui/core/LinearProgress'
import ErrorMsg from '../ErrorMsg'

import * as WS from '../api/ws-api'

import './workspaces.scss'
import GenericViewer from './viewers/GenericViewer'


const getJobResultDir = (path) => {
  const parts = path.split('/')
  const name = parts.pop()
  return `${parts.join('/')}/.${name}`
}



type Props = {
  viewType?: 'jobResult' | 'objectSelector' | 'file'

  // options for the object selector 'viewType'
  fileType?: string
  path?: string
  onSelect?: (obj: object) => void
}


export default function Workspaces(props: Props) {
  const {
    fileType,
    onSelect
  } = props

  const history = useHistory()
  const paramPath = useParams().path

  const [path, setPath] = useState(props.path || decodeURIComponent('/' + paramPath))
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  const [showDetails, setShowDetails] = useLocalStorage('uiSettings', 'showDetails')
  const [showHidden, setShowHidden] = useLocalStorage('uiSettings', 'workspaceShowHidden')

  const [viewType, setViewType] = useState(props.viewType)
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


  // listen if we need to change to job result view
  useEffect(() => {
    setViewType(props.viewType)
  }, [props.viewType])


  // update rows displayed to user
  const updateList = useCallback(() => {
    (async function () {
      setLoading(true)
      setRows(null)
      setError(null)

      try {
        // if job result, we'll fetch data from dot folder instead
        let jobDir = viewType == 'jobResult' ? getJobResultDir(path) : null

        // determine file type so we can set the workspace view type if needed
        if (!['objectSelector', 'jobResult'].includes(viewType) && path.split('/').length > 2) {
          const type = await WS.getType(path)

          if (type != 'job_result' && type != 'folder') {
            setLoading(false)
            setViewType('file')
            return
          } else {
            setViewType(undefined)
          }
        }

        // get list of objects (table rows)
        const data = await WS.list({path: jobDir ? jobDir : path})
        setRows(data)

        // remove actions after list refresh
        setSelected([])
      } catch (err) {
        setError(err)
      }

      setLoading(false)
    })()
  }, [path, viewType])


  // update workspace list whenever path changes
  useLayoutEffect(() => {
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


  // breadcrumb navigation for object selector
  const onNavigateBreadcrumbs = (evt, path) => {
    if (viewType != 'objectSelector') return

    evt.preventDefault()
    evt.stopPropagation()

    setPath(path)
  }


  // onNavigate deals with double click events and object selector navigation
  const onNavigate = (evt, obj) => {
    if (viewType == 'objectSelector') {
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
    <Root viewType={viewType}>
      <WSSidebar
        path={path}
        viewType={viewType}
        onNavigate={onNavigate}
      />

      <Main>

        <ActionBarContainer>
          <WSActionBar
            path={path}
            selected={selected}
            onUpdateList={() => updateList()}
            onShowDetails={() => setShowDetails(prev => !prev)}
            onShowHidden={() => setShowHidden(prev => !prev)}
            viewType={viewType}
            onNavigateBreadcrumbs={onNavigateBreadcrumbs}
          />

          {viewType == 'jobResult' &&
            <JobResultOverview
              path={path}
              wsObjects={rows}
            />
          }
        </ActionBarContainer>

        <FileListContainer>
          {loading && <Progress className="card-progress" /> }

          {viewType =='file' ?
            <GenericViewer path={path} /> :
            <FileList
              rows={rows}
              onSelect={handleSelect}
              onNavigate={onNavigate}
              viewType={viewType}
              fileType={fileType}
            />
          }

          {error && <ErrorMsg error={error} />}
        </FileListContainer>

      </Main>

      {showDetails &&
        <WSDetailsSidebar
          selection={selected}
          onClose={() => setShowDetails(false)}
        />
      }

    </Root>
  )
}

const headerHeight = 55

const getOffset = (type) => {
  if (type == 'objectSelector') {
    return `${32 * 2 + 64 + 120}px`
  }

  return `${headerHeight}px`
}

const Root = styled.div`
  display: flex;
  max-height: calc(100% - ${p => getOffset(p.viewType)});
  height: 100%;
  padding: 4px 5px 5px 0;
  background: #fff;
`

const Main = styled.div`
  position: relative;
  width: calc(100% - ${sidebarWidth});
`

const ActionBarContainer = styled.div`
  padding: 15px 0px 15px 15px;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
`

const FileListContainer = styled.div`
  padding: 0 5px;
`

