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
  title: string | JSX.Element
  fileType: string
  onSelect: (path: string) => void
}

export default function ObjectSelectorDialog(props: Props) {
  const {
    title,
    fileType,
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

      <DialogRoot
        className="dialog"
        fullWidth
        maxWidth="md"
        fullScreen={fullScreen} // for mobile
        open={open}
        scroll="paper"
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

        <DialogContent>
          <Workspaces
            isObjectSelector
            path={path}
            onSelect={handleSelect}
            fileType={fileType}
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
      </DialogRoot>
    </>
  )
}

const DialogRoot = styled(Dialog)`
  .MuiDialogTitle-root {
    padding: 16px 24px 0 16px;
  }

  // override for sticky actions and table header
  .MuiDialog-paperScrollPaper {
    display: block;
  }
`

const FolderBtn = styled(Button)`
  &.MuiButton-root {
    min-width: 0;
    margin-left: 2px;
  }

`
