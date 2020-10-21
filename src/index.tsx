

import React, {lazy, Suspense} from 'react'
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import { render } from 'react-dom'
import styled from 'styled-components'

import { NavBar } from './nav-bar/NavBar'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

// views
import Home from './home/BVBRC'
import GlobalSearch from './search/GlobalSearch'
import Account from './user-profile/my-profile'

import TaxonTabs from './views/taxon/TaxonTabs'
import GenomeTabs from './views/genome/GenomeTabs'
import HostTabs from './views/hosts/HostTabs'

import Jobs from './jobs/Jobs'
import Workspaces from './workspaces/Workspaces'
import JobResult from './workspaces/JobResult'
import SUSignIn from './auth/SuSignIn'
import NotFound404 from './404'
import ErrorBoundary from './ErrorBoundary'

import {isSignedIn} from './api/auth'
import SignIn from './auth/SignIn'

import { UploadStatusProvider } from './workspaces/upload/UploadStatusContext'
import { JobStatusProvider } from './jobs/JobStatusContext'

import 'regenerator-runtime/runtime'

import './styles/styles.scss'


const colors = {
  primary: '#2e75a3',
  secondary: '#42a242'
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.secondary,
      contrastText: '#fff'
    }
  }
})


const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>

          <UploadStatusProvider>
            <JobStatusProvider>

              <NavBar />

              <Root>
                <Main>
                  <Suspense fallback={<div>loading...</div>}>
                    <Switch>
                      <Route path="/" exact component={Home} />
                      <Route path="/search/" component={GlobalSearch} />
                      <Route path="/my-profile" exact component={Account} />

                      <Route path="/apps/Assembly2" exact component={lazy(() => import('./apps/Assembly'))} />
                      <Route path="/apps/Annotation" exact component={lazy(() => import('./apps/Annotation'))} />
                      <Route path="/apps/ComprehensiveSARS2Analysis" exact component={lazy(() => import('./apps/SARS2Analysis'))} />
                      <Route path="/apps/blast" exact component={lazy(() => import('./apps/Blast'))} />
                      <Route path="/apps/GenomeAlignment" exact component={lazy(() => import('./apps/GenomeAlignment'))} />

                      <Route path="/jobs*" render={() =>
                        isSignedIn() ? <Jobs/> : <SignIn title="Please sign in to view Job Status" />}
                      />

                      <Route path="/files/:path*" exact render={() =>
                        isSignedIn() ? <Workspaces/> : <SignIn title="Please sign in to use Workspaces" />}
                      />
                      <Route path="/job-result/:path*" exact render={() =>
                        isSignedIn() ? <JobResult/> : <SignIn title="Please sign in to use Workspaces" />}
                      />


                      <Route path="/taxonomy/:taxonID/:view" exact render={() =>
                        <TaxonTabs />
                      } />
                      <Route path="/genome/:genomeID/:view" render={() =>
                        <GenomeTabs />
                      } />
                      <Route path="/hosts/:taxonID/:view" render={() =>
                        <HostTabs />
                      } />

                      <Route path="/susignin" exact component={SUSignIn} />
                      <Route path="*" component={NotFound404} />

                    </Switch>
                  </Suspense>
                </Main>
              </Root>
            </JobStatusProvider>
          </UploadStatusProvider>

        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

const Root = styled.div`
`

const Main = styled.div`
  margin-top: 38px;
  padding: 0;
`

render(<App />, document.getElementById('app'))
