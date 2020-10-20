import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import downloadIcon from '../../../assets/icons/download.svg'

import {getMeta, getDownloadUrls} from '../../api/ws-api'

const images = ['png', 'jpg', 'gif']

const GenericViewer = (props) => {
  const {path} = props

  const [data, setData] = useState(null)

  const [name, setName] = useState(null)
  const [isImg, setIsImg] = useState(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    (async () => {
      const meta = await getMeta(path)
      const url = await getDownloadUrls(path)

      console.log('generic viewer meta', meta)

      setName(meta.name)
      setUrl(url)

      if (images.includes(meta.type)) {
        setIsImg(true)
      }
    })()

  }, [path])

  return (
    <Root>
      <Title className="align-items-center">
        <span>{name}</span>
        {url && <a href={url}><img src={downloadIcon} className="icon hover"/> </a>}
      </Title>
      {isImg &&
        <img src={url} />
      }
    </Root>
  )
}

const Root = styled.div`

`

const Title = styled.h3`
  display: flex;
  span {
    margin-right: 10px;
  }
`

export default GenericViewer
