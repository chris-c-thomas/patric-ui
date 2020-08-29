

import React, {lazy, Suspense} from 'react'
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import { render } from 'react-dom'
import styled from 'styled-components'

import { NavBar } from './nav-bar/nav-bar'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

// views
import Home from './home/home'
import Account from './user-profile/my-profile'
import TaxonTabs from './genome-tabs/taxon/tabs'
import GenomeTabs from './genome-tabs/genome/tabs'
import Jobs from './jobs/jobs'
import Workspaces from './workspaces/workspaces'
import SUSignIn from './auth/su-sign-in'
import NotFound404 from './404'


import './styles/styles.scss'

import { JobStatusProvider } from './jobs/job-status-context'


const colors = {
  primary: '#2e75a3',
  secondary: '#629821'
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
        <JobStatusProvider>
          {<NavBar />}

          <Root>

            <Main>
              <Suspense fallback={<div>loading...</div>}>
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/my-profile" exact component={Account} />
                  <Route path="/apps/annotation" exact component={lazy(() => import('./apps/Annotation'))} />
                  <Route path="/apps/assembly" exact component={lazy(() => import('./apps/Assembly'))} />
                  <Route path="/apps/sars-cov-2" exact component={lazy(() => import('./apps/SARS2Analysis'))} />
                  <Route path="/jobs*" component={Jobs}/>
                  <Route path="/files/:path*" exact component={Workspaces} />
                  <Route path="/taxonomy/:taxonID/:view" exact render={() =>
                    <TaxonTabs />
                  } />
                  <Route path="/genome/:genomeID/:view" render={() =>
                    <GenomeTabs />
                  } />

                  <Route path="/susignin" exact component={SUSignIn} />
                  <Route path="*" component={NotFound404} />

                </Switch>
              </Suspense>
            </Main>
          </Root>
        </JobStatusProvider>

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
