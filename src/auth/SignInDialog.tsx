
import React, {useState, useEffect} from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import SignInForm from './SignInForm'


export default function SignInDialog(props) {
  const {onClose} = props

  const [open, setOpen] = useState(props.open)

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  function handleClose() {
    setOpen(false)
    if (onClose) onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dragable-dialog"
      maxWidth="xs"
    >
      <DialogTitle>Sign In</DialogTitle>
      <div style={{padding: 25}}>
        <SignInForm />
      </div>
    </Dialog>
  )
}