import React, {useState, useEffect, useCallback, useLayoutEffect, useContext} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import styled from 'styled-components'

import WSSidebar, {sidebarWidth} from './WSSidebar'
import WSDetailsSidebar from './WSDetailsSidebar'
import FileList from './FileList'
import WSActionBar from './WSActionBar'
import JobResultOverview from './JobResultOverview'

import useLocalStorage from '../hooks/useLocalStorage'

import { UploadStatusContext } from './upload/UploadStatusContext'

import Progress from '@material-ui/core/LinearProgress'
import ErrorMsg from '../ErrorMsg'

import * as WS from '../api/ws-api'

import FileViewer from './viewers/FileViewer'
import { isWorkspace } from './WSUtils'
import './workspaces.scss'


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

  const [uploads] = useContext(UploadStatusContext)

  const [showDetails, setShowDetails] = useLocalStorage('uiSettings', 'showDetails')
  const [showHidden, setShowHidden] = useLocalStorage('uiSettings', 'workspaceShowHidden')

  const [viewType, setViewType] = useState(props.viewType)
  const [selected, setSelected] = useState([])


  // listen for path changes for object selector
  useEffect(() => {
    if (!props.path) return
    setPath(props.path)
  }, [props.path])


  // listen for url path changes for workspace browser
  useEffect(() => {
    if (!paramPath) return
    setPath('/' + paramPath)
  }, [paramPath])


  // listen if we need to change view type
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
        let _path = path

        // if public, always strip out '/public'
        const onlyPublic = _path.startsWith('/public')
        _path = onlyPublic ? `${_path.slice(7)}/` : _path

        // if 'shared with me', always strip out '/shared-with-me'
        const onlySharedWithMe = _path.startsWith('/shared-with-me')
        _path = onlySharedWithMe ? `${_path.slice(15)}/` : _path

        // determine file type so we can set the workspace view type if needed
        if (!['objectSelector', 'jobResult'].includes(viewType) && !isWorkspace(_path)) {
          const type = await WS.getType(_path)

          if (type != 'job_result' && type != 'folder') {
            setLoading(false)
            setViewType('file')
            return
          } else {
            setViewType(undefined)
          }
        }

        // if job result, we'll fetch data from dot folder instead
        _path = viewType == 'jobResult' ? getJobResultDir(_path) : _path

        // get list of objects (table rows)
        const data = await WS.list({
          path: _path,
          showHidden,
          onlyPublic,
          onlySharedWithMe
        })
        setRows(data)

        // remove actions after list refresh
        setSelected([])
      } catch (err) {
        setError(err)
      }

      setLoading(false)
    })()
  }, [path, viewType, showHidden])


  // update workspace list whenever path changes
  useLayoutEffect(() => {
    updateList()
  }, [path, updateList])


  // update workspace list whenever upload state on that folder changes too
  useEffect(() => {
    const paths = uploads.inProgress.map(obj => obj.path)
    if (paths.includes(path))
      updateList()

  }, [path, updateList, uploads.inProgress])


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
            showHidden={showHidden}
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
            <FileViewer path={path} /> :
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

      {showDetails && viewType != 'objectSelector' &&
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

