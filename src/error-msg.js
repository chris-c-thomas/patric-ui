import React, {useState} from 'react';
import ContactDialog from './outreach/contact-dialog';

export default function ErrorMsg(props) {
  const [open, setOpen] = useState(false);
  const {error} = props;

  const msg = error.response ? error.response.data.error.message : null;

  return (
    <>
      <div className="alert alert-fail">
        {error.message} - {msg || 'Something has gone wrong.'}
        <br/>
        Please <a onClick={() => setOpen(true)}>contact us</a> to be notified when this issue is resolved.
      </div>

      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}