

import React, {lazy, Suspense, Fragment} from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import { render } from "react-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { NavBar } from './nav-bar';
import { ActionBar } from './action-bar';
import { Genomes } from './genome-tabs/genomes/genomes';
import { PFContainer } from './genome-tabs/protein-families/protein-families';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Home from './home';
import JobStatus from './jobs/job-status';
import Account from './my-profile';
import Jobs from './jobs/jobs';
import NotFound404 from './404';

import * as Auth from './api/auth-api';

import './styles/styles.scss'


// lazy load apps
const Annotation = lazy(() => import('./apps/annotation'));
const Assembly = lazy(() => import('./apps/assembly'));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2e75a3'
    },
    secondary: {
      main: '#FFA750',
      contrastText: '#dc7216'
    },
  }
});

const useStyles = makeStyles(theme => ({
  root: {
  },
  card: {
    minWidth: 275,
    margin: '10px'
  },
  content: {
    marginTop: '40px',
    paddingTop: '10px'
  },
  tabs: {
    background: 'rgba(0, 0, 0, 0.03)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.125)',
  },
  home: {
    marginTop: '40px',
    padding: '20px'
  }
}));


function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

const App = () => {
  const styles = useStyles();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div className={styles.root}>

          <NavBar />

          {Auth.isSignedIn() && <JobStatus />}

          <div className={styles.content}>

            <Suspense fallback={<div>loading...</div>}>
              <Switch>
                <Route path="/" exact render={() =>
                  <Home />
                }/>

                <Route path="/my-profile" exact render={() =>
                  <Account />
                }/>

                <Route path="/apps/annotation" exact render={() =>
                  <Annotation />
                } />
                <Route path="/apps/assembly" exact render={() =>
                  <Assembly />
                } />

                <Route path="/jobs" exact render={() =>
                  <Jobs />
                } />

                <Route path='*' component={NotFound404} />

                {/* START genome tabs */}
                <div>
                  <ActionBar />

                    <Paper className={styles.card}>

                    <Route
                      path="/"
                      render={({ location }) => (
                        <Fragment>
                          <Tabs
                            value={location.pathname}
                            variant="scrollable"
                          scrollButtons="auto"
                          className={styles.tabs}
                        >
                          <Tab disableRipple component={Link} label="Overview" value="/overview"  to="/overview" />
                          <Tab disableRipple component={Link} label="Phylogeny" value="/phylogeny" to="/phylogeny" />/>
                          <Tab disableRipple component={Link} label="Genomes" value="/genomes"  to="/genomes" />
                          <Tab disableRipple component={Link} label="Protein Families" value="/protein-families"  to="/protein-families" />/>
                          <Tab disableRipple component={Link} label="AMR Phenotypes"  value="/amr-phenotypes"  to="/amr-phenotypes" />/>
                          <Tab disableRipple component={Link} label="Sequences" value="/sequences" to="/features" />/>
                          <Tab disableRipple component={Link} label="Features"  value="/features" to="/sequences"  />
                          <Tab disableRipple component={Link} label="Specialty Genes" value="/spec-genes" to="/spec-genes" />
                          <Tab disableRipple component={Link} label="Pathways" value="/pathways" to="/pathway" />
                          <Tab disableRipple component={Link} label="Subsystems" value="/subsystems" to="/subsytems" />
                          <Tab disableRipple component={Link} label="Transcriptomics" value="/transcriptomics" to="/transcriptomics" />
                          <Tab disableRipple component={Link} label="Interactions" value="/interactions" to="interactions" />
                        </Tabs>

                        <Switch>
                          <Route path="/overview"         render={() => <div>Overview goes here</div>}/>
                          <Route path="/genomes"          render={() => <Genomes />}/>
                          <Route path="/protein-families" render={() => <PFContainer />}/>
                        </Switch>
                      </Fragment>
                    )}
                    /> {/* END Route */}
                  </Paper>
                </div>
                {/* END genome tabs */}
              </Switch>
            </Suspense>
          </div>
          {/* END content area */}

        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
};

render(<App />, document.getElementById('app'));