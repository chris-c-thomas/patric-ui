//
// todo(nc): reveal password option
// todo(nc): style error messages
//
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import TextInput from '../apps/components/text-input';

import { adminSignIn} from '../api/auth';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({

});


export default function SUSignInForm(props) {
  const styles = useStyles();

  const [user, setUser] = useState(null);
  const [pass, setPass] = useState(null);

  const [inProgress, setInProgress] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [failMsg, setFailMsg] = useState(null);

  const handleSignIn = evt => {
    evt.preventDefault();

    setInProgress(true);
    adminSignIn(user, pass)
      .then(() => {
        window.location.href = '/system-status'
      }).catch(err => {
        setInProgress(false);
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

  return (
    <form onSubmit={handleSignIn}>
      <Typography variant="h5">
        Administrator Sign In
      </Typography>

      <DialogContent>
        <Grid container item direction="column" alignItems="center" xs={12}>

          <TextInput label="Username" onChange={val => setUser(val)} fullWidth/>
          <TextInput label="Password" type="password" onChange={val => setPass(val)} fullWidth/>

          {isInvalid && <div>Invalid username and/or password</div>}
          {failMsg && <div>{failMsg}</div>}
        </Grid>
        <br/>
      </DialogContent>

      <DialogActions>
        <Button color="primary"
          variant="contained"
          disabled={!user || !pass || inProgress}
          type="submit"
        >
          {inProgress ? 'Signing in...' : 'Sign In'}
        </Button>
      </DialogActions>
    </form>
  );
}