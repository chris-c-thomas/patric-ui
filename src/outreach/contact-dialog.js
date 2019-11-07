
import React, {useState, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';

import TextInput from '../apps/components/text-input';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

/**
 * todo: fields spec for api
 *
  form.append('name', name);
  form.append('email', email || '');
  form.append('subject', subject);
  form.append('content', msg);
  form.append('appVersion', config.appVersion);
  form.append('url', window.location.href);
  form.append('userId', user);
  form.append('attachment', file || '');
*/

export default function ContactDialog(props) {
  const {onClose} = props;

  const [open, setOpen] = useState(props.open);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  function handleClose() {
    setOpen(false)
    if (onClose) onClose();
  }

  function sendMsg() {
    const form =  JSON.stringify(form, null, 4);
    alert(
      `The backend for /reportProblem needs to be implemented.
      Here's the data:<br>${form}`
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle style={{ cursor: 'move' }} id="dragable-dialog">
        Provide Feedback
      </DialogTitle>

      <form onSubmit={sendMsg}>
        <DialogContent>
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <TextInput label="Subject" onChange={subject => setForm({subject, ...form})} />
            </Grid>
            <Grid item xs={12}>
              <TextField multiline rows={5} aria-label="provide feedback message"
                variant="outlined"
                placeholder="Add your message..." />
            </Grid>

            {error && <div className="alert alert-fail">{error.message}</div>}
          </Grid>
          <br/>
        </DialogContent>

        <DialogActions>
          <Button color="primary"
            variant="contained"
            disabled={!form.subject || !form.msg}
            type="submit"
          >
            Send
          </Button>
        </DialogActions>
      </form>

    </Dialog>
  );
}