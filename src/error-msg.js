import React, {useState} from 'react';
import ContactDialog from './outreach/contact-dialog';

export default function ErrorMsg(props) {
  const [open, setOpen] = useState(false);
  const {error, noContact} = props;

  const res = error.response;
  console.log('res', res)

  let msg;
  if (res && res.data != '') {
    msg = res.data.error.message
  } else if (res && 'statusText' in res) {
    msg = res.statusText
  } else {
    msg = null
  }

  return (
    <>
      <div className="alert alert-fail">
        {error.message} - {msg || 'Something has gone wrong.'}
        <br/>
        {
          !noContact &&
          <>
            Please <a onClick={() => setOpen(true)}>contact us</a> to be notified when this issue is resolved.
          </>
        }
      </div>

      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}