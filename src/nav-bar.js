

import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

import Typography from '@material-ui/core/Typography';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import logo from './patric-logo-88h.png';
import SearchIcon from '@material-ui/icons/Search';
import StorageIcon from '@material-ui/icons/StorageRounded';
import ServiceIcon from '@material-ui/icons/Settings';
import DocsIcon from '@material-ui/icons/LibraryBooks';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Caret from '@material-ui/icons/ArrowDropDown';


const useStyles = makeStyles(theme => ({

  appBar: {
    flexGrow: 1,
    background: '#2e76a3',
    borderTop: '3px solid #154e72'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menu: {
    flexGrow: 1,
    color: '#c0dcec', // slightly brighter than mockup
    fontSize: '.9em',
    '& span': {
      marginRight: theme.spacing(3),
    },
    '& svg': {
      fontSize: '1.05em',
    }
  },
  brand: {
    marginRight: theme.spacing(8),
  },
  version: {
    fontSize: '50%',
    color: '#e57200'
  },
  logoImg: {
    height: '22px'
  },
  logoText: {
    position: 'absolute',
    left: '60px',
    bottom: '-8px'
  },
  account: {
    color: '#c0dcec',
    '& svg': {
      fontSize: '1.4em'
    }
  }
}))

export function NavBar() {
  const classes = useStyles();


  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar variant="dense">
        <Typography variant="h5" className={classes.brand}>
          <img src={logo} className={classes.logoImg} />
          <span className={classes.version}>3.5.41</span>
        </Typography>

        <div className={classes.menu}>
          <span><SearchIcon /> Search <Caret /></span>
          <span><StorageIcon /> Browse <Caret /></span>
          <span><ServiceIcon /> Services <Caret /></span>
          <span><DocsIcon /> Docs <Caret /></span>
        </div>

        <div className={classes.account}>
          <Button color="inherit"><AccountIcon/> Login</Button>
        </div>

      </Toolbar>
    </AppBar>
  );
};
