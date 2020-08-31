import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'


type Props = {
  title: string
  contentTitle?: string
  content?: string | JSX.Element
  loadingText?: string
  onClose: () => void
  onConfirm: () => void | Promise<any>
}


export default function CreateDialog(props: Props) {
  const {
    title = 'Confirmation',
    contentTitle,
    content,
    loadingText,
    onClose,
    onConfirm
  } = props

  // const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = (evt) => {
    evt.preventDefault()
    setLoading(true)

    const res = onConfirm()
    if (res instanceof Promise) {
      res.then(() => {
        setLoading(false)
        onClose()
      })
    } else {
      onConfirm()
      setLoading(false)
      onClose()
    }
  }

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <form onSubmit={onSubmit}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {contentTitle &&
            <DialogContentText>
              {contentTitle}
            </DialogContentText>
          }

          {content}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>

          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading && loadingText ?
              loadingText : 'OK'
            }
          </Button>
        </DialogActions>
      </form>

    </Dialog>

  )
}