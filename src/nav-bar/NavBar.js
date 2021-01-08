import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'

import AccountIcon from '@material-ui/icons/AccountCircle'
import ExitIcon from '@material-ui/icons/ExitToApp'
import SUIcon from '@material-ui/icons/SupervisedUserCircle'
// import MenuIcon from '@material-ui/icons/MenuRounded'
import Divider from '@material-ui/core/Divider'
// import Avatar from '@material-ui/core/Divider'

import ListItem from '@material-ui/core/ListItem'

import logo from '../../assets/imgs/patric-logo-88h.png'

import * as Auth from '../api/auth'
import SignInDialog from '../auth/SignInDialog'

import DropdownMenu from './menu'

import { UploadStatusContext } from '../workspaces/upload/UploadStatusContext'
import { JobStatusContext } from '../jobs/JobStatusContext'

import FancySearch from './FancySearch'



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
  {label: 'All Bacteria', taxon: 2},
  {label: 'All Phages', taxon: 10239},
  {label: 'All Archea', taxon: 2157},
  {label: 'Eukaryotic Hosts', taxon: 2759},
]


const bacteriaServices = [
  {label: 'Assembly', url: '/apps/Assembly2'},
  {label: 'Annotation', url: '/apps/Annotation'},
  {label: 'Comprehensive Genome Analysis', url: '/apps/ComprehensiveGenomeAnalysis'},
  {label: 'Phylogentic Tree', url: '/apps/PhylogeneticTree'},
  {label: 'Variation Analysis', url: '/apps/Variation'},
  {label: 'Tn-Seq Analysis', url: '/apps/Tnseq'},
  {label: 'Genome Alignment', url: '/apps/GenomeAlignment'},
  // {label: 'BLAST', url: '/apps/blast'},
]

const metagenomicsServices = [
  {label: 'Metagenomic Read Mapping', url: '/apps/MetagenomicReadMapping'},
  {label: 'Metagenomic Binning', url: '/apps/MetagenomicBinning'},
  {label: 'Taxonomic Classification', url: '/apps/TaxonomicClassification'},
]

const viralServices = [
  {label: 'SARS-CoV-2 Assembly and Annotation', url: '/apps/ComprehensiveSARS2Analysis'}
]

const dataServices = [
  {label: 'Fastq Utilities', url: '/apps/FastqUtil'}
]

const getMiddle = data => Math.round(data.length / 2)

const NavItem = ({label, url}) =>
  <ListItem button component={Link} to={url} disableRipple>
    {label}
  </ListItem>

const TaxonColumn = ({data}) =>
  <Column>
    {data.map(({label, taxon}, i) =>
      <NavItem label={label} url={`/taxonomy/${taxon}/overview`} key={i} />
    )}
  </Column>

const ServicesColumn = ({data}) =>
  <Column>
    {data.map(({label, url}) =>
      <NavItem label={label} url={url} key={label}/>
    )}
  </Column>

const Column = styled.div`
  display: inline-block;
`

const PatricMenus = () => {
  const [uploads] = useContext(UploadStatusContext)
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
            <MenuTitle>Bacterial Genomics</MenuTitle>
            <ServicesColumn data={bacteriaServices} />
            <MenuTitle>Metagenomics</MenuTitle>
            <ServicesColumn data={metagenomicsServices} />
          </MenuSection>
          <MenuSection>
            <MenuTitle>Viral Genomics</MenuTitle>
            <ServicesColumn data={viralServices} />
            <MenuTitle>Data Services</MenuTitle>
            <ServicesColumn data={dataServices} />
          </MenuSection>
        </DropDown>
      }/>

      <Button component={Link} to={`/files/${Auth.getUser(true)}/home`} disableRipple>
        Workspaces
        <BadgeCount
          badgeContent={uploads.progress}
          invisible={uploads.progress == 0 || uploads.progress == '100%'}
        />
      </Button>

      <Button component={Link} to="/jobs" disableRipple>
        Job Status
        <BadgeCount badgeContent={jobs.queued + jobs.inProgress} max={999} />
      </Button>

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

const AccountSection = styled.div`
`

const BadgeCount = styled(Badge)`
  .MuiBadge-badge {
    top: -11;
    padding: 0 4px;
    background-color: #de9302;
  }
`

const Spacer = styled(Divider)`
  && {
    margin: 8px 0px;
    background-color: rgb(81 137 177);
  }
`

const userAccount = () => (
  <DropdownMenu
    label={
      <Avatar className="avatar">
        {Auth.getUser().charAt(0)}
      </Avatar>
    }
    caret={false}
    style={{minWidth: 1, margin: 0}}
    menu={
      <DropDown>
        <AccountSection>
          <MenuTitle style={{padding: 10, fontWeight: '1.2em'}}>
            Signed in as: <b>{Auth.getUser()}</b>
          </MenuTitle>
          <MenuItem component={Link} to="/my-profile" disableRipple>
            <AccountIcon/> My profile
          </MenuItem>
          {
            Auth.isAdmin() ?
              <MenuItem onClick={Auth.suSwitchBack} disableRipple>
                <ExitIcon/> SU switch Back
              </MenuItem> :
              <MenuItem component={Link} to="/susignin" disableRipple>
                <SUIcon/> SU sign in
              </MenuItem>
          }

          <MenuItem onClick={Auth.signOut} disableRipple>
            <ExitIcon/> Sign out
          </MenuItem>
        </AccountSection>
      </DropDown>
    }
  />
)


export function NavBar(props) {
  // const location = useLocation()
  const {isAdminApp, MenuComponnt, Logo} = props

  const [openSignIn, setOpenSignIn] = useState(false)

  // accunt menu
  const [anchorEl, setAnchorEl] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)

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

  const handleSearchFocus = (isFocused) => {
    setSearchFocus(isFocused)
  }


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
    <NavBarRoot className="nav-bar">
      <Toolbar variant="dense" style={{height: 38, justifyContent: 'flex-end'}}>

        {Logo ? <Logo /> : <LogoComponent />}

        {isAdminApp &&
          <MainNav>
            <MenuComponnt/>
          </MainNav>
        }

        {!isAdminApp &&
          <MainNav fullWidth={!searchFocus}>
            {!searchFocus && <PatricMenus />}
          </MainNav>
        }

        {!isAdminApp &&
          <FancySearch
            onFocus={handleSearchFocus}
            fullWidth={searchFocus}
          />
        }

        <DropdownMenu
          label="About" // {<MenuIcon />}
          style={{minWidth: 1, margin: '0 8px'}}
          caret={false}
          menu={
            <DropDown className="about-menu" >
              <MenuSection>
                <MenuTitle>{'About & Help'}</MenuTitle>
                <Column>
                  <NavItem label="coming soon!" to="/"/>
                </Column>
              </MenuSection>
            </DropDown>
          }
        />

        {!Auth.isSignedIn() && !isAdminApp &&
          <SignInBtn
            size="small"
            color="secondary"
            variant="contained"
            onClick={() => setOpenSignIn(true)}
            disableRipple
          >
            Sign In
          </SignInBtn>
        }

        {isAdminApp ?
          adminAccount() :
          (Auth.isSignedIn() ? userAccount() : <></>)
        }
      </Toolbar>

      <SignInDialog open={openSignIn} onClose={() => setOpenSignIn(false)}/>
    </NavBarRoot>
  )
}

const NavBarRoot = styled(AppBar)`
  background: #2e76a3; // #234d69 !important; //
  border-top: 3px solid #154e72; //#234d69;
  position: fixed;
  top: 0;

  & .brand {
    margin-right: 10px;
  }
`

const MainNav = styled.div`
  display: flex;
  margin-left: 5px;
  flex-grow: 1;
  font-size: .9em;
  margin-right: 5px;

  transition: flex cubic-bezier(.32,.77,.47,.86) 0.25s;
  ${props => !props.fullWidth &&
    'flex: 0;'}

  span {
    padding: 0px 3px;
    color: #fff
  }

  .nav-item:hover {
    color: #fff;
  }

  .nav-item.active {
    color: #fff;
    margin-top: -3px;
    border-top: 3px solid #fff;
    transition: all 100ms;
    font-weight: 500;
  }
`

const SignInBtn = styled(Button)`
  margin-bottom: 2px;
  color: #fff;
  height: 30px;

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
  &.MuiButtonBase-root {
    min-width: 0px;
  }
`

