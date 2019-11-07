import React, {useState} from 'react';
import ContactDialog from './outreach/contact-dialog';

export default function ErrorMsg(props) {

  const [open, setOpen] = useState(false);
  console.log('here')
  return (
    <>
      <div className="alert alert-fail">
        {props.error.message} - Something has gone wrong.<br/>
        Feel free to <a onClick={() => setOpen(true)}>contact us</a> and we'll notify you when this issue is resolved.
      </div>

      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}