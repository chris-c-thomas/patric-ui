import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import CloseIcon from '@material-ui/icons/Close'
import CheckIcon from '@material-ui/icons/CheckCircleOutline'

import { IconButton, Divider, Button, Tooltip } from '@material-ui/core'

import ProgressBar from './ProgressBar'

import { UploadStatusContext } from './UploadStatusContext'

import { UploadStatus } from '../../api/upload'

/*
const uploads = {
  active: {
    '/file/path1/upload 1': {
      fullPath: '/file/path2/upload 1',
      path: '/file/path1/',
      name: 'foo bar 1234',
      progress: 30
    },
    '/file/path2/foo bar 2': {
      fullPath: '/file/path2/upload 2',
      path: '/file/path2/',
      name: 'foo bar 1234',
      progress: 20
    },
    '/file/path4/upload4': {
      fullPath: '/file/path4/upload4',
      path: '/file/path4/',
      name: 'foo bar abc',
      progress: 65
    }
  },
  complete: {
    '/path/some completed upload': {
      fullPath: '/path/some completed upload',
      path: '/path/',
      name: 'awesome file',
      progress: 100
    }
  }
}
*/

type UploadListProps = {
  mapping: {[fullPath: string]: UploadStatus}
  onCancel?: (fullPath: string) => void
  onRemove?: (fullPath: string) => void
}

const UploadList = (props: UploadListProps) => {
  const {mapping, onCancel, onRemove} = props

  return (
    <>
      {Object.keys(mapping)
        .map((key, i) => {
          const {fullPath, path, name, progress} = mapping[key]

          return (
            <>
              <Upload key={fullPath}>
                <Name>
                  <Link to={`/files${path}`}>{name}</Link>

                  {progress == 100 ?
                    <Tooltip title={'hide'}>
                      <IconButton onClick={() => onRemove(fullPath)} size="small" disableRipple>
                        <CheckIcon color="secondary"/>
                      </IconButton>
                    </Tooltip> :
                    <Tooltip title={'cancel upload'}>
                      <IconButton onClick={() => onCancel(fullPath)} size="small" disableRipple>
                        <CloseIcon/>
                      </IconButton>
                    </Tooltip>

                  }
                </Name>

                {progress == 100 ?
                  'Upload complete!' :
                  <ProgressBar value={progress} showValue />
                }
              </Upload>

              {i < Object.keys(mapping).length - 1  && <Divider />}
            </>
          )
        })
      }
    </>
  )
}



const UploadStatusComponent = () => {
  const [uploads] = useContext(UploadStatusContext)

  const handleCancel = (fullPath) => {
    uploads.cancelUpload(fullPath)
  }

  const handleRemove = () => {
    uploads.removeUpload()
  }

  const handleCancelAll = () => {
    uploads.cancelAll()
  }

  if (!Object.keys(uploads.active).length) {
    return <></>
  }

  return (
    <Root>
      <Divider />
      <Title>
        Uploads
        <Button onClick={handleCancelAll} size="small" color="primary" disableRipple>
          cancel all
        </Button>
      </Title>

      <Uploads>
        <UploadList mapping={uploads.complete} onRemove={handleRemove} />
        <UploadList mapping={uploads.active} onCancel={handleCancel} />
      </Uploads>
    </Root>
  )
}

const Root = styled.div`
  margin-top: 50px;
`

const Title = styled.div`
  font-size: 1.2em;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Uploads = styled.div`
  padding: 0 10px;
  overflow-y: scroll;
`

const Upload = styled.div`
  border-radius: 5px;
  // border: 1px solid #f2f2f2;
  padding: 5px;
  margin-bottom: 10px;
`

const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`



export default UploadStatusComponent
