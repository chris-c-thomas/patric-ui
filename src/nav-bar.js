

import React, {useState } from "react";
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
  const style = useStyles();

  const [show, setShow] = useState(false);

  return (
    <AppBar position="static" className={style.appBar}>
      <Toolbar variant="dense" className={style.toolbar}>
        <Typography variant="h5" className={style.brand}>
          <img src={logo} className={style.logoImg} />
          <span className={style.version}>3.5.41</span>
        </Typography>

        <div className={style.menu}>
          <span><SearchIcon /> Search</span>
          <span><StorageIcon /> Browse</span>
          {/*<span onMouseOver={() => { setShow(true) }} onMouseLeave={() => setShow(false)}>
            <ServiceIcon /> Services
          </span>*/}
          <span><ServiceIcon /> Services</span>
          <span><DocsIcon /> Docs </span>

          <div className="dropdown-menu" style={{display: show ? 'block' : 'none'}}>
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
          <Button color="inherit"><AccountIcon/> Login</Button>
        </div>

      </Toolbar>
    </AppBar>
  );
};
