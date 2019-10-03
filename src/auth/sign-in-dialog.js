//
// todo(nc): reveal password option
// todo(nc): style error messages
//

import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextInput from '../apps/components/text-input';

import * as Auth from '../api/auth-api';


export default function SignInDialog(props) {
  const {onClose} = props;

  const [open, setOpen] = useState(props.open);
  const [user, setUser] = useState(null);
  const [pass, setPass] = useState(null);

  const [isInvalid, setIsInvalid] = useState(false);
  const [failMsg, setFailMsg] = useState(null);


  useEffect(() => {
    setOpen(props.open)
  }, [props.open])


  const handleSignIn = evt => {
    evt.preventDefault();

    Auth.signIn(user, pass)
      .catch(err => {
        const error = err.response.data;
        const status = error.status;
        if (status == 401) {
          setIsInvalid(true)
          return;
        }

        const msg = err.response.data.message;
        setFailMsg(msg);
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

      <form onSubmit={handleSignIn}>
        <DialogContent>
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <TextInput label="Username" onChange={val => setUser(val)} />
            </Grid>
            <Grid item xs={12}>
              <TextInput label="Password" type="password" onChange={val => setPass(val)}/>
            </Grid>

            {isInvalid && <div>Invalid username and/or password</div>}
            {failMsg && <div>{failMsg}</div>}
          </Grid>
          <br/>
        </DialogContent>

        <DialogActions>
          <Button color="primary"
            variant="contained"
            disabled={!user || !pass}
            type="submit"
          >
            Sign in
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}