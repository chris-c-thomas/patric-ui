import React from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import UserGuideDialog from './components/user-guide-dialog';

export function AppHeader(props) {
  const {title, description, onUseExample, userGuideURL} = props;

  return (
    <Grid container spacing={1}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
        <Typography variant="h5" component="h3">
          {title} <UserGuideDialog url={userGuideURL} />
        </Typography>
        </Grid>

        {onUseExample &&
          <Grid item>
            <small><a onClick={onUseExample}>use example</a></small>
          </Grid>
        }
      </Grid>

      <Grid item>
        <Typography className="app-description">
          {description}
        </Typography>
      </Grid>
    </Grid>
  )
}


export function SubmitBtns({onSubmit, onReset}) {
  return (
    <Grid container spacing={1} justify="space-between" className="submit-bar">
      <Grid item>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          className="no-raised"
          disableRipple
          >
          Submit
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={onReset} disableRipple>
          Reset
        </Button>
      </Grid>
    </Grid>
  )
}