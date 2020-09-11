import React, { useState } from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

import FolderIcon  from '@material-ui/icons/FolderOutlined'

// import { ButtonGroup } from '@material-ui/core';
// import NavNextIcon from '@material-ui/icons/NavigateNextRounded';
// import NavBeforeIcon from '@material-ui/icons/NavigateBeforeRounded';

import {getUser} from '../../../api/auth'
import Workspaces from '../../../workspaces/Workspaces'
import { Close } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'



export default function ObjectSelectorDialog(props) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const path = `/${getUser(true)}/home`

  const {title, type} = props

  const [open, setOpen] = useState(false)
  const [selectedPath, setSelectedPath] = useState(null)


  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function onSelect(path) {
    setSelectedPath(path)

    // callback for setting input box
    props.onSelect(path)
  }

  return (
    <>
      <FolderBtn
        color="primary"
        onClick={handleClickOpen}
        disableRipple
      >
        <FolderIcon />
      </FolderBtn>

      <Dialog
        className="dialog"
        fullWidth
        maxWidth="lg"
        fullScreen={fullScreen} // for mobile
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        <span id="dialog-title">
          <div className="flex space-between align-items-center">
            <div>
              {title}
            </div>
            <IconButton onClick={handleClose} color="primary" disableRipple autoFocus>
              <Close />
            </IconButton>
          </div>
        </span>

        <DialogContent>
          <Workspaces
            isObjectSelector
            path={path}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" disableRipple autoFocus>
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained" disableRipple disabled={!selectedPath}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


const Header = styled(DialogTitle)`
  && .MuiDialogTitle-root {
    padding: 0;
  }
`

const FolderBtn = styled(Button)`
  &.MuiButton-root {
    min-width: 0;
    margin-left: 2px;
  }
`
