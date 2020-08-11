import React, {useState } from "react";
import clsx from 'clsx';
import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components'

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import TextField from '@material-ui/core/TextField';

import AccountIcon from '@material-ui/icons/AccountCircle';
import CaretIcon from '@material-ui/icons/ArrowDropDownRounded';
import ExitIcon from '@material-ui/icons/ExitToApp';
import SUIcon from '@material-ui/icons/SupervisedUserCircle';

import ListItem from '@material-ui/core/ListItem';


import logo from '../../assets/imgs/patric-logo-88h.png';

import * as Auth from '../api/auth';
import SignInDialog from '../auth/sign-in-dialog';

import DropdownMenu from './menu';



const LogoComponent = () => {
  return (
    <Typography variant="h5" className="brand" component={Link} to="/">
      <Logo src={logo} />
      <Version></Version>
    </Typography>
  )
}

const Logo = styled.img`
  margin-bottom: 2px;
  height: 24px;
`

const Version = styled.span`
  font-size: 50%;
  color: #e57200;
  margin-bottom: 20;
`


const organisms = [
  {label: "Acinetobacter", taxon: 469},
  {label: "Bacillus", taxon: 1386},
  {label: "Bartonella", taxon: 773},
  {label: "Borreliella", taxon: 64895},
  {label: "Brucella", taxon: 234},
  {label: "Burkholderia", taxon: 32008},
  {label: "Campylobacter", taxon: 194},
  {label: "Chlamydia", taxon: 810},
  {label: "Clostridium", taxon: 1485},
  {label: "Coxiella", taxon: 776},
  {label: "Ehrlichia", taxon: 943},
  {label: "Escherichia", taxon: 561},
  {label: "Francisella", taxon: 262},
  {label: "Helicobacter", taxon: 209},
  {label: "Listeria", taxon: 1637},
  {label: "Mycobacterium", taxon: 1763},
  {label: "Pseudomonas", taxon: 286},
  {label: "Rickettsia", taxon: 780},
  {label: "Salmonella", taxon: 590},
  {label: "Shigella", taxon: 620},
  {label: "Staphylococcus", taxon: 1279},
  {label: "Streptococcus", taxon: 1301},
  {label: "Vibrio", taxon: 662},
  {label: "Yersinia", taxon: 62},
]

const allOrganisms = [
  {label: "All Bacteria", taxon: 1},
  {label: "All Phages", taxon: 10239},
  {label: "All Archea", taxon: 2157},
  {label: "Eukaryotic Hosts", taxon: 2759},
]


const services = [
  // {label: "Assembly", url: '/apps/assembly'},
  // {label: "Annotation", url: '/apps/annotation'},
  {label: "SARS-CoV-2 Assembly and Annotation", url: '/apps/sars-cov-2'},
]

const getMiddle = data => Math.round(data.length / 2);

const OrganismsColumn = ({data}) =>
  <Column>
    {
      data.map(({label, taxon}) =>
        <NavItem label={label} url={`/taxonomy/${taxon}/overview`} key={label}/>
      )
    }
  </Column>

const ServicesColumn = ({data}) =>
  <Column>
    {
      data.map(({label, url}) =>
        <NavItem label={label} url={url} key={label}/>
      )
    }
  </Column>

const Column = styled.div`
  display: inline-block;
`

const NavItem = ({label, url}) =>
  <ListItem button
    component={Link}
    to={url}
    disableRipple
  >
    {label}
  </ListItem>



const PatricMenus = () => {
  return (
    <>
      <DropdownMenu label="Organisms" menu={
        <div>
          <MenuTitle>Bacteria Pathogens</MenuTitle>
          <OrganismsColumn data={organisms.slice(0, getMiddle(organisms))} />
          <OrganismsColumn data={organisms.slice(getMiddle(organisms))} />
          <br/>
          <br/>

          <OrganismsColumn data={allOrganisms.slice(0, getMiddle(allOrganisms))} />
          <OrganismsColumn data={allOrganisms.slice(getMiddle(allOrganisms))} />
        </div>
      }/>

      <DropdownMenu label="Services" menu={
        <div>
          <MenuTitle>Genomics</MenuTitle>
          <ServicesColumn data={services} />
        </div>
      }/>

      <DropdownMenu label="Workspaces" menu={
        <div>
          <NavItem label={'My Workspaces'} url={`/files/${Auth.getUser(true)}`} />
        </div>
      }/>

      <Button color="inherit" disableRipple component={Link} to="/jobs">
        Job Status
      </Button>
    </>
  )
}

const MenuTitle = styled.div`
  font-size: 1em;
  background: #2e76a3;
  color: #f2f2f2;
  padding: 5px;
`

const useStyles = makeStyles(theme => ({
  menu: {
    flexGrow: 1,
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
  accountMenu: {
    '& svg': {
      marginRight: 5
    }
  }
}))


export function NavBar(props) {
  const styles = useStyles();

  const {isAdminApp, MenuComponnt, Logo} = props;

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
    <NavBarRoot>
      <Toolbar variant="dense" style={{height: 38}}>

        {Logo ? <Logo /> : <LogoComponent />}

        <div className={clsx(styles.menu, 'nav-bar')}>
          {isAdminApp ? <MenuComponnt/> : <PatricMenus />}
        </div>

        {!isAdminApp &&
          <Button color="inherit" onClick={openAccountMenu} disableRipple>
            About <CaretIcon/>
          </Button>
        }

        {Auth.isSignedIn() &&
          <AccountBtn color="inherit" onClick={openAccountMenu} disableRipple>
            <AccountIcon/>&nbsp;{Auth.getUser()}
          </AccountBtn>
        }

        {!Auth.isSignedIn() && !isAdminApp &&
          <SignInBtn
            size="small"
            style={{background: "rgb(214, 137, 0)", color: '#fff'}}
            variant="contained"
            onClick={() => setOpenSignIn(true)}
            disableRipple
          >
            Sign in&nbsp;<ExitIcon/>
          </SignInBtn>
        }

        {isAdminApp ? adminAccount() : userAccount()}
      </Toolbar>

      <SignInDialog open={openSignIn} onClose={() => setOpenSignIn(false)}/>
    </NavBarRoot>
  );
};

const NavBarRoot = styled(AppBar)`
  flex-grow: 1;
  background: '#2e76a3';
  border-top: 3px solid #154e72;
  position: fixed;
  top: 0;

  & .brand {
    margin-right: 10px;
  }
`

const SignInBtn = styled(Button)`
  margin-bottom: 2px;
  color: #f2f2f2;
  background: #1e98bb;

  &:hover: {
    background: #157f9d;
  }
`


const AccountBtn = styled(Button)`
  min-width: 30px;
`

const SearchField = styled(TextField)`

`

