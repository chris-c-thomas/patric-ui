

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

import ViewerRouter from './views/viewers/'
import TaxonTabs from './views/taxon/TaxonTabs'
import GenomeTabs from './views/genome/GenomeTabs'
import HostTabs from './views/hosts/HostTabs'


import {isSignedIn} from './api/auth'
import SignIn from './auth/SignIn'

import Jobs from './jobs/Jobs'
import Workspaces from './workspaces/Workspaces'
import SUSignIn from './auth/SuSignIn'

import Progress from './utils/ui/Progress'
import NotFound404 from './404'
import ErrorBoundary from './ErrorBoundary'

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

      <ThemeProvider theme={theme}>
        <UploadStatusProvider>
          <JobStatusProvider>

            <NavBar />

            <Root>
              <ErrorBoundary>
                <Main>
                  <Suspense fallback={<Progress />}>
                    <Switch>
                      <Route path="/" exact component={Home} />
                      <Route path="/search/" component={GlobalSearch} />
                      <Route path="/my-profile" exact component={Account} />

                      {/* workspac / job routes */}
                      <Route path="/jobs*" render={() =>
                        isSignedIn() ? <Jobs/> : <SignIn title="Please sign in to view Job Status" type="workspace"/>}
                      />
                      <Route path="/files/:path*" exact render={() =>
                        isSignedIn() ? <Workspaces/> : <SignIn title="Please sign in to use Workspaces" type="workspace" />}
                      />
                      <Route path="/job-result/:path*" exact render={() =>
                        isSignedIn() ? <Workspaces viewType="jobResult" /> : <SignIn title="Please sign in to use Workspaces" type="workspace" />}
                      />

                      {/* views */}
                      <Route path="/view/:view" exact component={ViewerRouter} />
                      <Route path="/taxonomy/:taxonID/:view" exact component={TaxonTabs} />
                      <Route path="/genome/:genomeID/:view" component={GenomeTabs} />
                      <Route path="/hosts/:taxonID/:view" render={HostTabs} />

                      {/* service routes */}
                      <Route path="/apps/Assembly2" component={lazy(() => import('./apps/Assembly2'))} />
                      <Route path="/apps/Annotation" component={lazy(() => import('./apps/Annotation'))} />
                      <Route path="/apps/ComprehensiveGenomeAnalysis" component={lazy(() => import('./apps/ComprehensiveGenomeAnalysis'))} />
                      <Route path="/apps/PhylogeneticTree" exact component={lazy(() => import('./apps/PhylogeneticTree'))} />
                      <Route path="/apps/Blast" exact component={lazy(() => import('./apps/Blast'))} />
                      <Route path="/apps/Variation" component={lazy(() => import('./apps/Variation'))} />
                      <Route path="/apps/Tnseq" component={lazy(() => import('./apps/Tnseq'))} />
                      <Route path="/apps/GenomeAlignment" exact component={lazy(() => import('./apps/GenomeAlignment'))} />
                      <Route path="/apps/MetagenomicReadMapping" exact component={lazy(() => import('./apps/MetagenomicReadMapping'))} />
                      <Route path="/apps/MetagenomicBinning" exact component={lazy(() => import('./apps/MetagenomicBinning'))} />
                      <Route path="/apps/TaxonomicClassification" exact component={lazy(() => import('./apps/TaxonomicClassification'))} />
                      <Route path="/apps/FastqUtil" exact component={lazy(() => import('./apps/FastqUtil'))} />
                      <Route path="/apps/ComprehensiveSARS2Analysis" exact component={lazy(() => import('./apps/SARS2Analysis'))} />

                      <Route path="/susignin" exact component={SUSignIn} />
                      <Route path="*" component={NotFound404} />

                    </Switch>
                  </Suspense>
                </Main>
              </ErrorBoundary>
            </Root>


          </JobStatusProvider>
        </UploadStatusProvider>


      </ThemeProvider>

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
