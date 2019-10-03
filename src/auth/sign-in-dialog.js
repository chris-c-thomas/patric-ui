import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextInput from '../apps/components/text-input';

import * as Auth from '../api/auth-api';


const usageError = (propName, value) => (
  `SignInDialog component must have prop: ${propName}.  Value was: ${value}`
)

export default function SignInDialog(props) {
  const {onClose} = props;

  const [open, setOpen] = useState(props.open);
  const [user, setUser] = useState(null);
  const [pass, setPass] = useState(null);

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])


  function handleSignIn() {
    Auth.signIn(user, pass)
      .then(() => {
        window.location.reload();
      }).catch((err) => {
        // todo: hanle errors
      })
  }

  function handleClose() {
    setOpen(false)
    if (onClose) onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dragable-dialog"
    >
      <DialogTitle style={{ cursor: 'move' }} id="dragable-dialog">
        Sign In
      </DialogTitle>

      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <TextInput label="Username" onChange={val => setUser(val)} />
          </Grid>
          <Grid item xs={12}>
            <TextInput label="Password" onChange={val => setPass(val)} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSignIn} color="primary">
          Sign in
        </Button>
      </DialogActions>
    </Dialog>
  );
}