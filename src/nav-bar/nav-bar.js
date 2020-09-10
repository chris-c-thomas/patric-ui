import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Badge from '@material-ui/core/Badge'

import AccountIcon from '@material-ui/icons/AccountCircle'
import CaretIcon from '@material-ui/icons/ArrowDropDownRounded'
import ExitIcon from '@material-ui/icons/ExitToApp'
import SUIcon from '@material-ui/icons/SupervisedUserCircle'

import ListItem from '@material-ui/core/ListItem'

import logo from '../../assets/imgs/patric-logo-88h.png'

import * as Auth from '../api/auth'
import SignInDialog from '../auth/sign-in-dialog'

import DropdownMenu from './menu'

import { JobStatusContext } from '../jobs/job-status-context'


const LogoComponent = () =>
  <Link to="/">
    <Logo src={logo} />
    <Version></Version>
  </Link>


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
  {label: 'Acinetobacter', taxon: 469},
  {label: 'Bacillus', taxon: 1386},
  {label: 'Bartonella', taxon: 773},
  {label: 'Borreliella', taxon: 64895},
  {label: 'Brucella', taxon: 234},
  {label: 'Burkholderia', taxon: 32008},
  {label: 'Campylobacter', taxon: 194},
  {label: 'Chlamydia', taxon: 810},
  {label: 'Clostridium', taxon: 1485},
  {label: 'Coxiella', taxon: 776},
  {label: 'Ehrlichia', taxon: 943},
  {label: 'Escherichia', taxon: 561},
  {label: 'Francisella', taxon: 262},
  {label: 'Helicobacter', taxon: 209},
  {label: 'Listeria', taxon: 1637},
  {label: 'Mycobacterium', taxon: 1763},
  {label: 'Pseudomonas', taxon: 286},
  {label: 'Rickettsia', taxon: 780},
  {label: 'Salmonella', taxon: 590},
  {label: 'Shigella', taxon: 620},
  {label: 'Staphylococcus', taxon: 1279},
  {label: 'Streptococcus', taxon: 1301},
  {label: 'Vibrio', taxon: 662},
  {label: 'Yersinia', taxon: 62},
]

const viruses = [
  {label: 'Bunyavirales', taxon: 1980410},
  {label: 'Caliciviridae', taxon: 11974},
  {label: 'Coronaviridae', taxon: 11118},
  {label: 'Dengue virus', taxon: 12637},
  {label: 'Ebolavirus', taxon: 186536},
  {label: 'Enterovirus', taxon: 12059},
  {label: 'Filoviridae', taxon: 11266},
  {label: 'Flaviviridae', taxon: 11050},
  {label: 'Hepatitis C Virus', taxon: 63746},
  {label: 'Hepeviridae', taxon: 291484},
  {label: 'Herpesviridae', taxon: 10292},
  {label: 'Lassa Mammarenavirus', taxon: 11620},
  {label: 'Paramyxoviridae', taxon: 11158},
  {label: 'Picornaviridae', taxon: 12058},
  {label: 'Pneumoviridae', taxon: 11244},
  {label: 'Poxviridae', taxon: 10240},
  {label: 'Reoviridae', taxon: 10880},
  {label: 'Rhabdoviridae', taxon: 11270},
  {label: 'SARS-CoV-2', taxon: 2697049},
  {label: 'Togaviridae', taxon: 11018},
  {label: 'Zika Virus', taxon: 64320}
]

const allOrganisms = [
  {label: 'All Bacteria', taxon: 1},
  {label: 'All Phages', taxon: 10239},
  {label: 'All Archea', taxon: 2157},
  {label: 'Eukaryotic Hosts', taxon: 2759},
]


const services = [
  {label: 'Assembly', url: '/apps/assembly'},
  {label: 'Annotation', url: '/apps/annotation'},
  {label: 'SARS-CoV-2 Assembly and Annotation', url: '/apps/sars-cov-2'},
]

const getMiddle = data => Math.round(data.length / 2)

const TaxonColumn = ({data}) =>
  <Column>
    {
      data.map(({label, taxon}, i) =>
        <NavItem label={label} url={`/taxonomy/${taxon}/overview`} key={i} />
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
  <ListItem button component={Link} to={url} disableRipple>
    {label}
  </ListItem>


const PatricMenus = () => {
  const [jobs] = useContext(JobStatusContext)

  return (
    <>
      <DropdownMenu label="Organisms" menu={
        <DropDown>
          <MenuSection>
            <MenuTitle>Bacteria Pathogens</MenuTitle>
            <TaxonColumn data={organisms.slice(0, getMiddle(organisms))} />
            <TaxonColumn data={organisms.slice(getMiddle(organisms))} />

            <br/>
            <br/>
            <TaxonColumn data={allOrganisms.slice(0, getMiddle(allOrganisms))} />
            <TaxonColumn data={allOrganisms.slice(getMiddle(allOrganisms))} />
          </MenuSection>

          <MenuSection>
            <MenuTitle>Viral Families</MenuTitle>
            <TaxonColumn data={viruses.slice(0, getMiddle(viruses))} />
            <TaxonColumn data={viruses.slice(getMiddle(viruses))} />
          </MenuSection>
        </DropDown>
      }/>

      <DropdownMenu label="Services" menu={
        <DropDown>
          <MenuSection>
            <MenuTitle>Genomics</MenuTitle>
            <ServicesColumn data={services} />
          </MenuSection>
        </DropDown>
      }/>

      {/*
      <DropdownMenu label="Workspaces" menu={
        <div>
          <NavItem label={'My Workspaces'} url={`/files/${Auth.getUser(true)}`} />
        </div>
      }/>
      */}

      <Button color="inherit" disableRipple component={Link} to={`/files/${Auth.getUser(true)}`}>
        Workspaces
      </Button>

      <JobCount badgeContent={jobs.queued + jobs.inProgress} max={999}>
        <Button color="inherit" disableRipple component={Link} to="/jobs">
          Job Status
        </Button>
      </JobCount>
    </>
  )
}

const DropDown = styled.div`
  display: flex;
  align-items: stretch;

  .MuiListItem-root {
    padding: 5px 10px;
  }
`

const MenuTitle = styled.div`
  font-size: .9em;
  background: #2e76a3;
  color: #f2f2f2;
  padding: 4px 5px;
`

const MenuSection = styled.div`
  margin-right: 5px;
`

const JobCount = styled(Badge)`
  .MuiBadge-badge {
    right: -2;
    top: 10;
    border: 2px solid #2e75a3;
    padding: 0 4px;
    background-color: #de9302;
  }
`


export function NavBar(props) {
  const {isAdminApp, MenuComponnt, Logo} = props

  const [openSignIn, setOpenSignIn] = useState(false)

  // accunt menu
  const [anchorEl, setAnchorEl] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  /**
   * account menu pieces
   */
  const openAccountMenu = (evt) => {
    setAnchorEl(evt.currentTarget)
    setIsMenuOpen(true)
  }

  const closeMenu = () => {
    setAnchorEl(null)
    setIsMenuOpen(false)
  }

  const openAboutMenu = () => {
    alert('Not implemented yet')
  }

  const userAccount = () => (
    <AccountMenu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={closeMenu}
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
    </AccountMenu>
  )

  // used for one-off applications likee the system-status
  const adminAccount = () => (
    <AccountMenu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={closeMenu}
    >
      <MenuItem onClick={Auth.signOut} disableRipple>
        <ExitIcon/> Sign out
      </MenuItem>
    </AccountMenu>
  )

  return (
    <NavBarRoot>
      <Toolbar variant="dense" style={{height: 35}}>

        {Logo ? <Logo /> : <LogoComponent />}

        {isAdminApp ?
          <div className="nav-bar">
            <MenuComponnt/>
          </div> :
          <div className="nav-bar">

            <PatricMenus />
          </div>
        }

        {!isAdminApp &&
          <Button color="inherit" onClick={openAboutMenu} disableRipple>
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
            color="secondary"
            variant="contained"
            onClick={() => setOpenSignIn(true)}
            disableRipple
          >
            Sign In&nbsp;<ExitIcon/>
          </SignInBtn>
        }

        {isAdminApp ? adminAccount() : userAccount()}
      </Toolbar>

      <SignInDialog open={openSignIn} onClose={() => setOpenSignIn(false)}/>
    </NavBarRoot>
  )
}

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
  color: #fff;

  &:hover {
    background: #157f9d;
  }
`

const AccountMenu = styled(Menu)`
  & svg {
    margin-right: 5;
  }
`


const AccountBtn = styled(Button)`
  min-width: 30px;
`

//const SearchField = styled(TextField)`

//`

