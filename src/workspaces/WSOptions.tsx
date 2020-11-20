import React, {useState} from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import FolderIcon from '@material-ui/icons/CreateNewFolderOutlined'
import UploadIcon from '@material-ui/icons/CloudUploadOutlined'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOffOutlined'

// import NewWSIcon from '../../assets/icons/add-workspace.svg'

import CreateDialog from './CreateDialog'
import UploadDialog from './upload/UploadDialog'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import {isWorkspace, Btn} from './WSUtils'



type DialogTypes = 'upload' | 'newFolder'

type Props = {
  path: string
  showHidden: boolean,
  viewType?: 'jobResult' | 'objectSelector' | 'file'
  onUpdateList: () => void
  onShowHidden: () => void
}

const Options = (props: Props) => {
  const {
    path,
    viewType,
    showHidden,
    onUpdateList,
    onShowHidden
  } = props

  const [dialog, setDialog] = useState<DialogTypes>(null)
  const [snack, setSnack] = useState(null)

  const onSuccess = (msg: string) => {
    setSnack(msg)
    onUpdateList()
  }


  const shouldShowOptions = () =>
    !['jobResult', 'file'].includes(viewType)  &&
    !path.startsWith('/public') &&
    !path.startsWith('/shared-with-me')

  return (
    <Root>
      {shouldShowOptions() &&
        <>
          <Button
            startIcon={showHidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
            onClick={onShowHidden}
            size="small"
            disableRipple
          >
            {showHidden ? 'Hide' : 'Show'} hidden
          </Button>

          <Btn startIcon={<UploadIcon />} onClick={() => setDialog('upload')}>
            Upload
          </Btn>

          <Btn startIcon={<FolderIcon />} onClick={() => setDialog('newFolder')}>
            {isWorkspace(path) ? 'New Workspace' : 'New Folder'}
          </Btn>
        </>
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
