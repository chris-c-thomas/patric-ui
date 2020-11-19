import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ErrorMsg from '../../ErrorMsg'

import Alert from '@material-ui/lab/Alert'
import Progress from '@material-ui/core/CircularProgress'

import downloadIcon from '../../../assets/icons/download.svg'
import { getDownloadUrls, getMeta, getObject } from '../../api/ws-api'
import { bytesToSize, isoToHumanDateTime } from '../../utils/units'
import { AxiosError } from 'axios'
import PhylogeneticTree from '../../views/viewers/PhylogeneticTree'


const TOO_LARGE_THRESHOLD = 10000000 // ~10mb


const OverviewTable = ({data}) => {
  const {
    name, type, created, owner, path, size
  } = data

  return (
    <table className="simple">
      <tbody>
        <tr><td>Filename</td><td>{name}</td></tr>
        <tr><td>Type</td><td>{type}</td></tr>
        <tr><td>Created</td><td>{isoToHumanDateTime(created)}</td></tr>
        <tr><td>Owner</td><td>{owner}</td></tr>
        <tr><td>Path</td><td>{path}</td></tr>
        <tr><td>Size</td><td>{bytesToSize(size)}</td></tr>
      </tbody>
    </table>
  )
}

const imageTypes = ['png', 'jpg', 'gif']

const Viewer = ({meta, data, url}) => {
  const {type} = meta

  let view
  if (imageTypes.includes(type))
    view = <img src={url} />
  else if (type == 'html')
    view =
      <iframe srcDoc={data}
        width="100%"
        height="100%"
        frameBorder="0"
        sandbox="allow-same-origin"
      />
  else if (type == 'pdf')
    view =
      <iframe src={`http://docs.google.com/gview?url=${url}&embedded=true`}
        width="100%"
        height="100%"
        frameBorder="0"
      />

  else if (type == 'unspecified')
    view = <OverviewTable data={meta} />
  else if (type == 'nwk')
    view = <PhylogeneticTree />

  else
    view =
      <pre
        style={{fontSize: '.8em', background:'#ffffff'}}
        dangerouslySetInnerHTML={{__html: data}}
      >
      </pre>

  return view
}

type Props = {
  path: string
}


const GenericViewer = (props: Props) => {
  const {path} = props

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<AxiosError>(null)

  // don't show stuff that is too large until user clicks 'load anyway'
  const [shouldLoad, setShouldLoad] = useState<boolean>(false)
  const [isRendering, setIsRendering] = useState<boolean>(false)

  const [state, setState] = useState({
    meta: null,
    data: null,
    url: null
  })

  // first fetch object meta and download url and
  // set shouldLoad based on file size
  useEffect(() => {
    (async () => {
      setLoading(true)
      let _path = path.startsWith('/public') ? `${path.slice(7)}/` : path
      _path = path.startsWith('/shared-with-me') ? `${path.slice(15)}/` : _path
      try {
        const [meta, url] = await Promise.all([await getMeta(_path), await getDownloadUrls(_path)])
        setState(prev => ({...prev, meta, url}))
        setShouldLoad(meta.size < TOO_LARGE_THRESHOLD)
      } catch (err) {
        setError(err)
      }
      setLoading(false)
    })()
  }, [path])


  // once we have the above, fetch actual data and render
  // if reasonable size or if you choses to render anyway
  useEffect(() => {
    (async () => {
      if (!state.meta || !shouldLoad) return

      setLoading(true)
      try {
        const {path} = state.meta
        const {data} = await getObject(path)

        setIsRendering(true)
        // don't block main proccess toindicate rendering-in-progress
        setTimeout(() => {
          setState(prev => ({...prev, data}))
          setIsRendering(false)
        })
      } catch (err) {
        setError(err)
      }
      setLoading(false)
    })()
  }, [state.meta, shouldLoad])


  return (
    <Root>
      {state.meta && state.url &&
        <Title className="align-items-center">
          <span>{state.meta.name}</span>
          <a href={state.url}><img src={downloadIcon} className="icon hover"/></a>
        </Title>
      }

      <Content>
        {loading && !error && !isRendering &&
          <Progress />
        }

        {state.meta && !shouldLoad &&
          <Alert severity="info">
            Note, this file is large ({bytesToSize(state.meta.size)}) and so it is not automatically rendered.<br/>
            <br/>
            <a onClick={() => setShouldLoad(true)}>show it anyway</a>
          </Alert>
        }

        {isRendering &&
          <Alert severity="info">
            The browser is now rendering your data.<br/>
            This may take a long time depending on the size of your data...
          </Alert>
        }

        {error &&
          <ErrorMsg error={error} />
        }

        {state.data && shouldLoad &&
          <Viewer {...state} />
        }
      </Content>

    </Root>
  )
}

const Root = styled.div`
  table {
    font-size: 1em;
    tr > td:first-child {
      width: 75px;
      font-weight: bold;
    }
  }
`

const Title = styled.h3`
  display: flex;
  span {
    margin-right: 10px;
  }

`

const Content = styled.div`
  margin-top: 20px;
  overflow: scroll;
  max-height: calc(100% - 100px);
`

export default GenericViewer
