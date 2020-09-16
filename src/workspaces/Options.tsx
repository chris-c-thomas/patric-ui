import React, {useState} from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FolderIcon from '@material-ui/icons/CreateNewFolderOutlined'
import UploadIcon from '@material-ui/icons/CloudUploadOutlined'
import VisibilityIcon from '@material-ui/icons/Visibility'
import MoreIcon from '@material-ui/icons/MoreVert'

// import NewWSIcon from '../../assets/icons/add-workspace.svg'

import CreateDialog from './CreateDialog'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'


const Btn = (props) =>
  <Button size="small" variant="outlined" color="primary" disableRipple {...props}>
    {props.children}
  </Button>


const isWorkspace = path =>
  (path.match(/\//g) || []).length == 1


type Props = {
  path: string
  onUpdateList: () => void
}

const Options = (props: Props) => {
  const {path, onUpdateList} = props

  const [open, setOpen] = useState(false)
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
      <Btn startIcon={<UploadIcon />} onClick={() => implement()}>
        Upload
      </Btn>
      <Btn startIcon={<FolderIcon />} onClick={() => setOpen(true)}>
        {isWorkspace(path) ? 'New Workspace' : 'New Folder'}
      </Btn>

      <Tooltip title="show details">
        <IconButton onClick={() => implement()} size="small" color="primary" disableRipple >
          <MoreIcon />
        </IconButton>
      </Tooltip>

      {open &&
        <CreateDialog
          type={isWorkspace(path) ? 'New Workspace' : 'New Folder'}
          path={path}
          onClose={() => setOpen(false)}
          onSuccess={onSuccess}
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
