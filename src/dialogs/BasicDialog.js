/**
 * basic reusable dialog
 */

import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'


const usageError = (propName, value) =>
  `ObjectSelector component must have prop: ${propName}.  Value was: ${value}`


export default function BasicDialog(props) {
  const {
    open, onClose, onPrimaryClick,
    title, primaryBtnText
  } = props

  if (!title) throw usageError('title', title)


  function handleClose() {
    if (onClose) onClose()
  }

  function onClickOK() {
    if (onPrimaryClick) onPrimaryClick()
  }

  return (
    <>
      <Dialog
        maxWidth={props.maxWidth}
        fullScreen={props.fullScreen}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
          {props.content}
        </DialogContent>

        <DialogActions>
          <Button color="primary"
            variant="contained"
            type="submit"
            disableRipple
            onClick={onClickOK}
          >
            {primaryBtnText ? primaryBtnText : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}