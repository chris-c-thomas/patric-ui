//
// todo(nc): provide general styling for icons next to text
//

import React, {useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import logo from './patric-logo-88h.png';
import FolderIcon from '@material-ui/icons/FolderOpen';
import StorageIcon from '@material-ui/icons/StorageRounded';
import ServiceIcon from '@material-ui/icons/Settings';
import AccountIcon from '@material-ui/icons/AccountCircle';
import CaretIcon from '@material-ui/icons/ArrowDropDownRounded';
import ExitIcon from '@material-ui/icons/ExitToApp';

import * as Auth from './api/auth-api';
import SignInDialog from './auth/sign-in-dialog';



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
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menu: {
    flexGrow: 1,
    color: '#c0dcec', // slightly brighter than mockup
    fontSize: '.9em',
    marginRight: '5px',
    '& span': {
      marginLeft: '5px'
    },
    '& svg': {
      fontSize: '1.4em',
    }
  },
  brand: {
    marginRight: theme.spacing(2),
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
  const style = useStyles();

  const [isNavOpen, setIsNavOpen] = useState(false);

  const [openSignIn, setOpenSignIn] = useState(false);

  // accunt menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    Auth.signOut()
  }

  /**
   * account menu pieces
   */
  const openAccountMenu = (evt) => {
    setAnchorEl(evt.currentTarget);
    setIsMenuOpen(true)
  }

  const closeAccountMenu = () => {
    setAnchorEl(null);
    setIsMenuOpen(false)
  }

  const accountMenu = () => (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={closeAccountMenu}
    >
      <MenuItem component={Link} to="/my-profile"><AccountIcon/> My Profile</MenuItem>
      <MenuItem onClick={handleSignOut}><ExitIcon/> Sign out</MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static" className={style.appBar}>
      <Toolbar variant="dense" className={style.toolbar}>
        <Typography variant="h5" className={style.brand} component={Link} to="/">
          <img src={logo} className={style.logoImg} />
          <span className={style.version}>demo</span>
        </Typography>

        <div className={style.menu}>
          <Button color="inherit" disableRipple>
            <StorageIcon />
            <span>Data</span>
          </Button>
          <Button color="inherit" disableRipple>
            <FolderIcon />
            <span>Workspace</span>
          </Button>
          <Button color="inherit" disableRipple>
            <ServiceIcon />
            <span>Services</span>
          </Button>
          {/*<span><DocsIcon /> Docs </span>*/}

          <div className="dropdown-menu" style={{display: isNavOpen ? 'block' : 'none'}}>
              <div className="container my-3">
                <div className="row">
                  <div className="col-md-3">
                    <h6><strong>Genomics</strong></h6>
                    <hr className="hr--brand-sm col-2 ml-0 mt-0" />
                    <div className="mb-3 list-group list-group-flush">
                      <a href="/app/Annotation" title="Service: Annotation">Annotation</a>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <h6><strong>Metagenomics</strong></h6>
                    <hr className="hr--brand-sm col-2 ml-0 mt-0" />
                    <div className="mb-3 list-group list-group-flush">
                    </div>
                    <h6><strong>Transcriptomics</strong></h6>
                    <hr className="hr--brand-sm col-2 ml-0 mt-0" />
                    <div className="mb-3 list-group list-group-flush">
                      <a href="/app/Expression" title="Service: Expression Import" className="list-group-item list-group-item-action">Expression Import</a>
                      <a href="/app/Rnaseq" title="Service: RNA-Seq Analysis" className="list-group-item list-group-item-action">RNA-Seq Analysis</a>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <h6><strong>Protein Tools</strong></h6>
                    <hr className="hr--brand-sm col-2 ml-0 mt-0" />
                    <div className="mb-3 list-group list-group-flush">
                      <a href="/app/ProteinFamily" title="Service: Protein Family Sorter" className="list-group-item list-group-item-action">Protein Family Sorter</a>
                      <a href="/app/SeqComparison" title="Service: Proteome Comparison" className="list-group-item list-group-item-action">Proteome Comparison</a>
                    </div>
                    <h6><strong>Metabolomics</strong></h6>
                    <hr className="hr--brand-sm col-2 ml-0 mt-0" />
                    <div className="mb-3 list-group list-group-flush">
                      <a href="/app/ComparativePathway" title="Service: Comparative Pathway" className="list-group-item list-group-item-action">Comparative Pathway</a>
                      <a href="/app/Reconstruct" title="Service: Model Reconstruction" className="list-group-item list-group-item-action">Model Reconstruction</a>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <h6><strong>Data</strong></h6>
                    <hr className="hr--brand-sm col-2 ml-0 mt-0" />
                    <div className="mb-3 list-group list-group-flush">
                      <a href="/app/IDMapper" title="Service: ID Mapper" className="list-group-item list-group-item-action">ID Mapper</a>
                    </div>
                    <h6><strong>Raw Data Download</strong></h6>
                    <hr className="hr--brand-sm col-2 ml-0 mt-0" />
                    <a className="btn btn-secondary" href="ftp://ftp.patricbrc.org/" title="Access PATRIC FTP Server" target="_blank"><i className="fa fa-download fa-fw"></i>&nbsp;FTP Server</a>
                  </div>
                </div>{/* end row */}
              </div>
          </div>
        </div>

        <div className={style.account}>
          {Auth.isSignedIn() &&
            <Button color="inherit" onClick={openAccountMenu} disableRipple>
              <AccountIcon/>&nbsp;{Auth.getUser()} <CaretIcon/>
            </Button>
          }

          {!Auth.isSignedIn() &&
            <Button color="inherit" onClick={() => setOpenSignIn(true)} disableRipple>
              <AccountIcon/>&nbsp;Sign in
            </Button>
          }
        </div>
        {accountMenu()}
      </Toolbar>

      <SignInDialog open={openSignIn} onClose={() => setOpenSignIn(false)}/>
    </AppBar>
  );
};
