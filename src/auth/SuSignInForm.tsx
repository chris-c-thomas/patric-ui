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

import TextInput from '../apps/components/TextInput';

import {suSignIn, getUser} from '../api/auth';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({

});


export default function SUSignInForm(props) {
  const styles = useStyles();

  const [pass, setPass] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  const [inProgress, setInProgress] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [failMsg, setFailMsg] = useState(null);

  const handleSignIn = evt => {
    evt.preventDefault();

    setInProgress(true);
    suSignIn(getUser(), pass, targetUser)
      .catch(err => {
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
        SU Sign In
      </Typography>

      <br />
      <div className="alert alert-warning">
        <b>WARNING:</b>  With great power comes great responsibility...<br/>
          You can take control of another user's account to troubleshoot or assist them.
          Please be careful and respectful of the user's account that you are controlling.
      </div>

      <DialogContent>
        <Grid container item direction="column" alignItems="center" xs={12}>

          <TextInput label="Target user" onChange={val => setTargetUser(val)} fullWidth/>
          <TextInput label="Your password" type="password" onChange={val => setPass(val)} fullWidth/>

          {isInvalid && <div>Invalid username and/or password</div>}
          {failMsg && <div>{failMsg}</div>}
        </Grid>
        <br/>
      </DialogContent>

      <DialogActions>
        <Button color="primary"
          variant="contained"
          disabled={!targetUser || !pass || inProgress}
          type="submit"
        >
          {inProgress ? 'Taking control...' : 'Take control'}
        </Button>
      </DialogActions>
    </form>
  );
}