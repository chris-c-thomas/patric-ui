import React, {useState} from 'react'
import ContactDialog from './outreach/contact-dialog'
import Alert from '@material-ui/lab/Alert'

export default function ErrorMsg(props) {
  const [open, setOpen] = useState(false)
  const {error, noContact} = props

  const res = error.response

  let msg
  if (res && res.data != '' && res.data.error) {
    msg = res.data.error.message
  } else if (res && 'statusText' in res) {
    msg = res.statusText
  } else {
    msg = null
  }

  return (
    <>
      <Alert severity="error" style={{wordBreak: 'break-all'}}>
        {error.message} - {msg || 'Something has gone wrong.'}

        {'config' in error && 'url' in error.config && `: ${error.config.url}`}

        {!noContact &&
          <p>
            Please <a onClick={() => setOpen(true)}>contact us</a> to be notified when this issue is resolved.
          </p>
        }
      </Alert>

      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}

