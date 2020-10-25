import React, {useState, useContext} from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Alert from '@material-ui/lab/Alert'


import FileDrop from './FileDrop'
import Selector from '../../apps/components/Selector'
import SelectedTable from '../../apps/components/SelectedTable'

import uploadTypes from './uploadTypes'
import { bytesToSize } from '../../utils/units'

import { UploadStatusContext } from './UploadStatusContext'

/**
 * helpers for dealing with hash structure of uploadTypes
 */
const getKnownTypes = () =>
  Object.keys(uploadTypes)
    .map(key => ({value: key, label: uploadTypes[key].label}))

const getInfo = (key) => uploadTypes[key].description

const getAcceptType = (key) => uploadTypes[key].formats.join(',')



type Props = {
  path: string
  onClose: () => void
}

export default function UploadDialog(props: Props) {
  const {
    path,
    onClose
  } = props

  const [_, uploadFiles] = useContext(UploadStatusContext)

  const [fileType, setFileType] = useState('unspecified')
  const [info, setInfo] = useState(null)
  const [acceptType, setAcceptType] = useState(null)

  const [fileMetas, setFileMetas] = useState([])
  const [fileObjs, setFileObjs] = useState(null)


  const updateFiles = (fileObjects) => {
    const names = fileMetas.map(f => f.name)
    fileObjects = fileObjects.filter(f => !names.includes(f.name))

    // store file objects
    setFileObjs(prev => Object.assign({}, prev, fileObjects))

    // add fileType
    const staged = Array.from(fileObjects).map(file => {
      const {name, size} = file
      return {name, size, fileType}
    })

    setFileMetas(prev => [...prev, ...staged])
  }

  const handleTypeChange = (val) => {
    setFileType(val)
    setAcceptType(getAcceptType(val))

    // update helper text
    if (val != 'unspecified') {
      setInfo(getInfo(val))
    } else {
      setInfo(null)
    }
  }

  const onRemove = ({index}) => {
    setFileMetas(prev => prev.filter((_, i) => i != index))
  }


  const onSubmit = (evt) => {
    evt.preventDefault()

    const files = fileMetas.map(file => ({
      path,
      name: file.name,
      type: file.fileType
    }))

    uploadFiles(files, fileObjs, path)
    onClose()
  }



  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
      <form onSubmit={onSubmit}>
        <div className="flex space-between">
          <DialogTitle id="form-dialog-title">
            Upload files to Workspace
          </DialogTitle>
          <div>
            <IconButton aria-label="close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        <DialogContent>
          <b>Destination:</b> {path}<br/><br/>

          <Section className="flex align-items-end pad">
            <div>
              <Selector
                label="Upload Type"
                width="200px"
                value={fileType}
                onChange={handleTypeChange}
                options={getKnownTypes()}
              />
            </div>

            {info &&
              <div>
                <Alert severity="info">
                  {info}
                </Alert>
              </div>
            }
          </Section>

          <Section>
            <FileDrop onDrop={updateFiles}>
              <input
                accept={acceptType}
                id="upload-files-button"
                multiple
                type="file"
                style={{display: 'none'}}
                onChange={evt => updateFiles(evt.target.files)}
              />
              <label htmlFor="upload-files-button">
                <Button variant="contained" color="primary" component="span" disableRipple>
                  Select files
                </Button>
              </label>
            </FileDrop>
          </Section>

          <Section>
            <SelectedTable
              columns={[
                {id: 'name', label: 'File', width: '50%'},
                {id: 'fileType', label: 'Type'},
                {id: 'size', label: 'Size', format: val => bytesToSize(val)},
                {button: 'removeButton'}
              ]}
              rows={fileMetas}
              onRemove={onRemove}
              emptyNotice="No files currently selected"
            />
          </Section>

        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>

          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={!fileMetas.length}
          >
            Start upload
          </Button>
        </DialogActions>
      </form>
    </Dialog>

  )
}


const Section = styled.div`
  margin: 0 0 20px 0;

  &.pad .MuiInputBase-root  {
    margin-right: 10px;
  }
`


