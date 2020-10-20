import React, {useState} from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FolderIcon from '@material-ui/icons/CreateNewFolderOutlined'
import UploadIcon from '@material-ui/icons/CloudUploadOutlined'
import VisibilityIcon from '@material-ui/icons/Visibility'
import InfoIcon from '@material-ui/icons/InfoOutlined'

// import NewWSIcon from '../../assets/icons/add-workspace.svg'

import CreateDialog from './CreateDialog'
import UploadDialog from './UploadDialog'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import { UploadStatusProvider } from './UploadStatusContext'


const Btn = (props) =>
  <Button size="small" variant="outlined" color="primary" disableRipple {...props}>
    {props.children}
  </Button>


const isWorkspace = path =>
  (path.match(/\//g) || []).length == 1


type DialogTypes = 'upload' | 'newFolder'

type Props = {
  path: string
  onUpdateList: () => void
  isObjectSelector?: boolean
}

const Options = (props: Props) => {
  const {path, onUpdateList, isObjectSelector} = props

  const [dialog, setDialog] = useState<DialogTypes>(null)
  const [snack, setSnack] = useState(null)


  const implement = () => {
    alert('Not implemented yet :(')
  }

  const onSuccess = (msg: string) => {
    setSnack(msg)
    onUpdateList()
  }

  return (
    <Root>
      <Button startIcon={<VisibilityIcon />} onClick={() => implement()} size="small" disableRipple>
        Show hidden
      </Button>
      <Btn startIcon={<UploadIcon />} onClick={() => setDialog('upload')}>
        Upload
      </Btn>
      <Btn startIcon={<FolderIcon />} onClick={() => setDialog('newFolder')}>
        {isWorkspace(path) ? 'New Workspace' : 'New Folder'}
      </Btn>

      {!isObjectSelector &&
        <Tooltip title="show details">
          <IconButton onClick={() => implement()} size="small" color="primary" disableRipple >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      }

      {dialog == 'newFolder' &&
        <CreateDialog
          type={isWorkspace(path) ? 'New Workspace' : 'New Folder'}
          path={path}
          onClose={() => setDialog(null)}
          onSuccess={onSuccess}
        />
      }

      {dialog == 'upload' &&
        <UploadDialog
          path={path}
          onClose={() => setDialog(null)}
        />
      }


      {snack &&
        <Snackbar open={true} autoHideDuration={5000} onClose={() => setSnack(null)}>
          <Alert onClose={() => setSnack(null)} severity="success">
            {snack}
          </Alert>
        </Snackbar>
      }
    </Root>
  )
}

const Root = styled.div`

`

export default Options
