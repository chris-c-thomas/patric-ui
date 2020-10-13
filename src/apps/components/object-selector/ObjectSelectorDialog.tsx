import React, { useState } from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core/styles'

import FolderIcon  from '@material-ui/icons/FolderOutlined'
import Close from '@material-ui/icons/Close'

import {getUser} from '../../../api/auth'
import Workspaces from '../../../workspaces/Workspaces'



type Props = {
  title: string
  type: string
  onSelect: (path: string) => void
}

export default function ObjectSelectorDialog(props: Props) {
  const {
    title,
    type,
    onSelect
  } = props

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const path = `/${getUser(true)}/home`


  const [open, setOpen] = useState(false)
  const [selectedPath, setSelectedPath] = useState(null)


  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleSelect(objs) {
    if (!objs.length) return  // todo(nc): shouldn't need this check

    const obj = objs[0]
    const {path} = obj

    // callback for setting input box
    if (selectedPath !== path)
      onSelect(path)

    setSelectedPath(path)
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
        maxWidth="md"
        fullScreen={fullScreen} // for mobile
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">
          <div className="flex space-between align-items-center">
            <div>
              {title}
            </div>
            <IconButton onClick={handleClose} color="primary" disableRipple autoFocus>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent style={{position: 'relative'}}>
          <Workspaces
            isObjectSelector
            path={path}
            onSelect={handleSelect}
            type={type}
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
