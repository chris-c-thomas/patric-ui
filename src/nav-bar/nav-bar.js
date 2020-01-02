import React, {useState } from "react";
import clsx from 'clsx';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import AccountIcon from '@material-ui/icons/AccountCircle';
import CaretIcon from '@material-ui/icons/ArrowDropDownRounded';
import ExitIcon from '@material-ui/icons/ExitToApp';
import SUIcon from '@material-ui/icons/SupervisedUserCircle';

import logo from '../../assets/imgs/patric-logo-88h.png';

import * as Auth from '../api/auth';
import SignInDialog from '../auth/sign-in-dialog';


const color = '#efefef';

const useStyles = makeStyles(theme => ({
  appBar: {
    flexGrow: 1,
    background: '#2e76a3',
    borderTop: '3px solid #154e72',
    position: 'fixed',
    top: 0
  },
  toolbar: {
    height: '35px'
  },
  brand: {
    marginRight: theme.spacing(2),
  },
  version: {
    fontSize: '50%',
    color: '#e57200',
    marginBottom: 20
  },
  logoImg: {
    marginBottom: 2,
    height: '24px'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  menu: {
    flexGrow: 1,
    color,
    fontSize: '.9em',
    marginRight: '5px',
    '& span': {
      marginLeft: '5px',
      color: '#fff'
    },
    '& svg': {
      fontSize: '1.4em',

    }
  },
  signInBtn: {
    marginBottom: 2,
    color: '#f2f2f2',
    background: '#1e98bb',
    '&:hover': {
      background: '#157f9d'
    }
  },
  account: {
    color,
    '& svg': {
      fontSize: '1.4em'
    }
  },
  accountMenu: {
    '& svg': {
      marginRight: 5
    }
  }
}))


const UserMenus = () => {
  return (
    <>
      <Button color="inherit" disableRipple>
        {/*<StorageIcon />*/}
        Organisms <CaretIcon/>
      </Button>
      <Button color="inherit" disableRipple>
        {/*<FolderIcon />*/}
        Workspaces <CaretIcon/>
      </Button>
      <Button color="inherit" disableRipple>
        {/*<ServiceIcon />*/}
        <span>Services</span> <CaretIcon/>
      </Button>
      <Button color="inherit" disableRipple component={Link} to="/jobs">
        {/*<JobsIcon />*/}
        Jobs
      </Button>
    </>
  )
}

export function NavBar(props) {
  const styles = useStyles();

  const {systemDash, MenuComponent} = props;

  const [openSignIn, setOpenSignIn] = useState(false);

  // accunt menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * account menu pieces
   */
  const openAccountMenu = (evt) => {
    setAnchorEl(evt.currentTarget);
    setIsMenuOpen(true)
  }

  const closeMenu = () => {
    setAnchorEl(null);
    setIsMenuOpen(false)
  }

  const userAccount = () => (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={closeMenu}
      className={styles.accountMenu}
    >
      <MenuItem component={Link} to="/my-profile" onClick={closeMenu} disableRipple>
        <AccountIcon/> My profile
      </MenuItem>
      {
        Auth.isAdmin() ?
        <MenuItem onClick={Auth.suSwitchBack} disableRipple>
          <ExitIcon/> SU switch Back
        </MenuItem> :
        <MenuItem component={Link} to="/susignin" onClick={closeMenu} disableRipple>
          <SUIcon/> SU sign in
        </MenuItem>
      }

      <MenuItem onClick={Auth.signOut} disableRipple>
        <ExitIcon/> Sign out
      </MenuItem>
    </Menu>
  );

  const adminAccount = () => (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={closeMenu}
      className={styles.accountMenu}
    >
      <MenuItem onClick={Auth.signOut} disableRipple>
        <ExitIcon/> Sign out
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar variant="dense" className={styles.toolbar}>
        <Typography variant="h5" className={styles.brand} component={Link} to="/">
          <img src={logo} className={styles.logoImg} />
          <span className={styles.version}></span>
        </Typography>

        <div className={clsx(styles.menu, 'nav-bar')}>
          {systemDash ? <>{MenuComponent}</> : <UserMenus />}
        </div>

        <div className={styles.account}>
          {Auth.isSignedIn() &&
            <Button color="inherit" onClick={openAccountMenu} disableRipple>
              <AccountIcon/>&nbsp;{Auth.getUser()} <CaretIcon/>
            </Button>
          }

          {!Auth.isSignedIn() && !systemDash &&
            <Button size="small"
              className={styles.signInBtn}
              color="inherit" variant="contained"
              onClick={() => setOpenSignIn(true)}
              disableRipple
            >
              Sign in&nbsp;<ExitIcon/>
            </Button>
          }
        </div>

        {systemDash ? adminAccount() : userAccount()}
      </Toolbar>

      <SignInDialog open={openSignIn} onClose={() => setOpenSignIn(false)}/>
    </AppBar>
  );
};
