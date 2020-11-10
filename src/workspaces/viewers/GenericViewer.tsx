import React, { useEffect, useState } from 'react'

import Progress from '@material-ui/core/CircularProgress'

import styled from 'styled-components'
import ErrorMsg from '../../ErrorMsg'

import downloadIcon from '../../../assets/icons/download.svg'
import { getDownloadUrls, getObject} from '../../api/ws-api'
import {bytesToSize, isoToHumanDateTime} from '../../utils/units'





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

const Switch = ({meta, data, type, url}) => {

  if (imageTypes.includes(type))
    return (<img src={url} />)
  else if (type == 'html')
    return (
      <iframe srcDoc={data}
        width="100%"
        height="100%"
        frameBorder="0"
        sandbox="allow-same-origin"
      />
    )
  else if (type == 'pdf')
    return (
      <iframe src={`http://docs.google.com/gview?url=${url}&embedded=true`}
        width="100%"
        height="100%"
        frameBorder="0"
      />
    )
  else if (type == 'unspecified')
    return (
      <OverviewTable data={meta} />
    )
  else
    return (
      <pre
        style={{fontSize: '.8em', background:'#ffffff'}}
        dangerouslySetInnerHTML={{__html: data}}
      >
      </pre>
    )
}


const imageTypes = ['png', 'jpg', 'gif']


const GenericViewer = (props) => {
  const {path} = props

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [type, setType] = useState(null)
  const [name, setName] = useState(null)
  const [meta, setMeta] = useState(null)
  const [data, setData] = useState(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const {meta, data} = await getObject(path)
        const url = await getDownloadUrls(path)

        const {type, name} = meta

        setType(type)
        setName(name)
        setMeta(meta)
        setData(data)
        setUrl(url)
      } catch (err) {
        setError(err)
      }
      setLoading(false)
    })()

  }, [path])

  return (
    <Root>
      <Title className="align-items-center">
        <span>{name}</span>
        {url && <a href={url}><img src={downloadIcon} className="icon hover"/> </a>}
      </Title>

      <Content>
        {loading && !error && <Progress />}

        {error && <ErrorMsg error={error} />}

        {data && url && type &&
          <Switch {...{meta, data: data.data, type, url}} />
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
  overflow: scroll;
  max-height: calc(100% - 100px);
`

export default GenericViewer
