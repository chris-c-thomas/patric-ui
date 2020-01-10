

import React, {lazy, Suspense} from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import { render } from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';

import { NavBar } from './nav-bar/nav-bar';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

// views
import Home from './home/home';
// import JobsTicker from './jobs/job-ticker';
// import { JobStatusProvider } from './jobs/job-status-context';
import Account from './my-profile';
import GenomeTabs from './genome-tabs/genome-tabs';
import Jobs from './jobs/jobs';
import Workspaces from './workspaces/workspaces';
import SUSignIn from './auth/su-sign-in';
import NotFound404 from './404';

import * as Auth from './api/auth';

import './styles/styles.scss'


// lazy load apps
const Annotation = lazy(() => import('./apps/annotation'));
const Assembly = lazy(() => import('./apps/assembly'));

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
  }
}));


const App = () => {
  const styles = useStyles();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>

        <div className={styles.root}>

          <NavBar />

          {/*
            Auth.isSignedIn() &&
            <JobStatusProvider>
              <JobsTicker />
            </JobStatusProvider>
          */}

          <div className={styles.content}>
            <Suspense fallback={<div>loading...</div>}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/my-profile" exact component={Account} />
                <Route path="/apps/annotation" exact component={Annotation} />
                <Route path="/apps/assembly" exact component={Assembly} />
                <Route path="/jobs/:app*" component={Jobs}/>
                <Route path="/files/:path*" exact component={Workspaces} />
                <Route path="/taxonomy/:taxonID/:view" exact render={() =>
                  <GenomeTabs />
                } />

                <Route path="/susignin" exact component={SUSignIn} />
                <Route path="*" component={NotFound404} />

              </Switch>
            </Suspense>
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
};

render(<App />, document.getElementById('app'));
