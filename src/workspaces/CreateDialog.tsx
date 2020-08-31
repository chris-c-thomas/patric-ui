import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'


import {createFolder} from '../api/ws-api'


type Props = {
  type: 'New Folder' | 'New Workspace'
  path: string
  onClose: () => void
  onSuccess: (msg: string) => void
}


export default function CreateDialog(props: Props) {
  const {
    type = 'New Folder',
    path,
    onClose,
    onSuccess
  } = props

  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = (evt) => {
    evt.preventDefault()

    const fullPath = `${path}/${value}`

    setLoading(true)
    createFolder(fullPath).then(() => {
      onSuccess(`${type} Created`)
      setLoading(false)
      onClose()
    }).catch(error => {
      alert(error)
      setLoading(false)
    })
  }

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <form onSubmit={onSubmit}>
        <DialogTitle id="form-dialog-title">Create {type}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="create-new-workspace-item"
            label={type}
            fullWidth
            placeholder={`My ${type}`}
            value={value}
            onChange={evt => setValue(evt.target.value)}
            variant="outlined"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>

          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={!value || loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>

    </Dialog>

  )
}