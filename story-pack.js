

import React, {lazy, Suspense} from 'react';
import { BrowserRouter, Switch, Route, useHistory} from 'react-router-dom';
import { render } from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import rawConfig from './story-pack.config'


const parseConfig = (config) => {
  return config.stories
}

const config = parseConfig(rawConfig)

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
  sidebar: {
    width: '200px'
  },
  content: {
    marginTop: '40px',
    paddingTop: '10px'
  }
}));

const Home = () => {
  return (
    <div>Story Pack!</div>
  )
}

const NotFound = () => {
  return (
    <div>URL not found!</div>
  )
}


const StoryNav = () => {
  const history = useHistory();

  const nav = (path) => {
    history.push(path);
  }

  const item = ({filePrefix, storyName, idx}) => (
    <TreeItem
      onClick={() => nav(storyName)}
      nodeId={filePrefix + storyName}
      key={idx}
      label={storyName}
    />
  )

  return (
    <>
    {
      Object.keys(config).map((filePrefix, i) => {
        return (
          <TreeItem nodeId={filePrefix} label={filePrefix} key={i}>
            {
              Object.keys(config[filePrefix]).map((storyName, j) =>
                item({filePrefix, storyName, idx: j})
              )
            }
          </TreeItem>
        )
      })
    }
    </>
  )
}

const StoryRoutes = () => {

  const getRoute = ({storyName, filePrefix, story}) => (
    <Route
      path={`/${storyName}`} exact
      component={story}
      key={filePrefix + storyName}
    />
  )

  return (
    <>
    {
      Object.keys(config).map(filePrefix => {
        return Object.keys(config[filePrefix]).map(storyName => {
          const story = config[filePrefix][storyName]
          return getRoute({story, storyName, filePrefix})
        })
      })
    }
    </>
  )
}

const App = () => {
  const styles = useStyles();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div className={styles.root}>

          <div className={styles.sidebar}>
            <TreeView
              className={styles.root}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <StoryNav/>
            </TreeView>
          </div>

          <div className={styles.content}>
            <Suspense fallback={<div>loading...</div>}>
              <Switch>
                <Route path="/" exact component={Home} />
                <StoryRoutes />
                <Route path="*" component={NotFound} />
              </Switch>
            </Suspense>
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
};

render(<App />, document.getElementById('app'));
