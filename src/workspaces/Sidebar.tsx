import React from 'react'
import {Link, useParams} from 'react-router-dom'
import styled from 'styled-components'

import InfoIcon from '@material-ui/icons/InfoOutlined'
import CaretIcon from '@material-ui/icons/ExpandMoreRounded'
import FolderIcon  from '@material-ui/icons/FolderOutlined'
import MyIcon from '@material-ui/icons/AccountCircleRounded'
import SharedIcon from '@material-ui/icons/PeopleAltRounded'
import PublicIcon from '@material-ui/icons/PublicRounded'
import SpecialFolderIcon from '@material-ui/icons/FolderSpecialRounded'

import {getUser} from '../api/auth'

// only for testing
import config from '../config'

const menu = [
  {
    path: `${getUser(true)}`, label: 'My Workspaces',
    icon: <MyIcon />, caret: true
  }, {
    path: `${getUser(true)}/home`, label: 'Home',
    level: 2, icon: <FolderIcon />, caret: true
  }, {
    path: `${getUser(true)}/home/Genome Groups`, label: 'Genome Groups',
    level: 3, icon: <SpecialFolderIcon />
  },{
    path: `${getUser(true)}/home/Feature Groups`, label: 'Feature Groups',
    level: 3, icon: <SpecialFolderIcon />
  }, {
    path: `${getUser(true)}/home/Experiment Groups`, label: 'Experiment Groups',
    level: 3, icon: <SpecialFolderIcon />
  }, {
    label: 'Shared with Me',
    icon: <SharedIcon />
  }, {
    label: 'Public Workspaces',
    icon: <PublicIcon />
  }
]


const WSSideBar = () => {
  const {path} = useParams()

  return (
    <SidebarRoot>
      <h3>
        Workspaces
        <sup>
          <P3Link
            href={`${config.p3URL}/workspace/${path}`}
            target="_blank"
          >
            <InfoIcon />
          </P3Link>
        </sup>
      </h3>

      <Menu>
        {menu.map((item) => (
          <li key={item.label}>
            <MenuItem
              level={item.level}
              caret={item.caret ? 1 : 0}
              className={item.path == path ? 'active no-style' : 'no-style hover'}
              to={`/files/${item.path}`}
            >
              {item.caret && <Caret><CaretIcon /></Caret>}
              {item.icon && <Icon>{item.icon}</Icon>}
              {item.label}
            </MenuItem>
          </li>
        ))}
      </Menu>
    </SidebarRoot>
  )
}

const sidebarWidth = '210px'

const SidebarRoot = styled.div`
  width: ${sidebarWidth};
  padding: 5px 0 10px 5px;
  border-right: 1px solid #ccc;

  .MuiTab-wrapper {
    display: inline-block;
  }
`

const Menu = styled.ul`
  position: relative;
  padding: 0;
  font-size: 1em;
  list-style: none;

  li {
    padding: 5px 0;
  }
`
const indention = 8

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;

  ${props => props.level &&
    `padding-left: ${props.level * indention + (!props.caret ? 21 : 0)};`}

  ${props => props.level &&
    `font-size: .9em`}

  &.active {
    font-weight: 800 !important;
  }
`

const Icon = styled.div`
  margin-right: 5px;
`

const Caret = styled.div`
  width: 20px;
  svg {
    width: 20px;
  }
`



const P3Link = styled.a`
  svg { font-size: 1.25em; }
`


export {sidebarWidth}

export default WSSideBar
