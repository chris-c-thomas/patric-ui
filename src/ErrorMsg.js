import React, {useState} from 'react'
import ContactDialog from './outreach/contact-dialog'
import Alert from '@material-ui/lab/Alert'


const parseConfigURL = (error) => {
  try {
    return error && 'config' in error && 'url' in error.config && `: ${error.config.url}`
  } catch(e) {
    return null
  }
}

const parseTraceback = (res) => {
  try {
    if (res && 'data' in res)
      return <pre>{res.data}</pre>
  } catch(e) {
    return null
  }
}

export default function ErrorMsg(props) {
  const [open, setOpen] = useState(false)
  const {error, noContact} = props

  const res = error.response
  console.log('res', res)


  let msg

  try {
    if (res && res.data != '' && res.data.error) {
      msg = res.data.error.message
    } else if (res && 'statusText' in res) {
      msg = res.statusText
    } else {
      msg = null
    }
  } catch(e) {
    msg = null
  }

  return (
    <>
      <Alert severity="error" style={{wordBreak: 'break-all'}}>
        {error.message} - {msg || 'Something has gone wrong'}

        {parseConfigURL(error)}

        {/* for data api errors */
          parseTraceback(res)
        }

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

