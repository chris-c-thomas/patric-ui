

import React from "react";
import { BrowserRouter, Switch, Route, Link, Redirect} from "react-router-dom";
import { render } from "react-dom";

import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { NavBar } from '../src/nav-bar';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import AdminSignInForm from '../src/auth/admin-sign-in-form';
import PrivateRoute from './private-route';

// views
import SystemStatus from './system-status';
import Tests from './tests';
import Gronkomatic from './gronkomatic';
import NotFound404 from '../src/404';

import '../src/styles/styles.scss'


const colors = {
  primary: '#2e75a3',
  secondary: '#FFA750'
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.secondary,
      contrastText: '#dc7216'
    }
  }
});

const useStyles = makeStyles(theme => ({
  root: {
  },
  content: {
    marginTop: '40px',
    paddingTop: '10px'
  },
  card: {
    maxWidth: 600,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2)
  }
}));


const SystemMenu = () => {
  return (
    <>
      <Button color="inherit" disableRipple component={Link} to="/system-status">
        System Status
      </Button>
      <Button color="inherit" disableRipple component={Link} to="/tests">
        Tests
      </Button>
      <Button color="inherit" disableRipple component={Link} to="/gronkomatic">
        Gronkomatic
      </Button>
    </>
  )
}

const SignIn = () => {
  const styles = useStyles();
  return (
    <Grid container justify="center">
      <Paper className={styles.card}>
        <AdminSignInForm />
      </Paper>
    </Grid>
  )
}

const App = () => {
  const styles = useStyles();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>

        <NavBar systemDash MenuComponent={<SystemMenu />}/>

        <div className={styles.content}>
          <Switch>
            <Route path="/" exact>
              <Redirect to="/system-status" />
            </Route>
            <Route path="/sign-in" exact component={SignIn} />
            <PrivateRoute path="/system-status" exact component={SystemStatus} />
            <PrivateRoute path="/tests" exact component={Tests} />
            <PrivateRoute path="/gronkomatic" exact component={Gronkomatic} />
            <Route path="*" component={NotFound404} />
          </Switch>
        </div>

      </ThemeProvider>
    </BrowserRouter>
  )
};

render(<App />, document.getElementById('app'));

