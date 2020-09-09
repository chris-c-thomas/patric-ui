import React, {useState} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'

import InfoIcon from '@material-ui/icons/InfoOutlined'
import CaretIcon from '@material-ui/icons/ExpandMoreRounded'
import FolderIcon  from '@material-ui/icons/FolderOutlined'
import MyIcon from '@material-ui/icons/AccountCircleRounded'
import SharedIcon from '@material-ui/icons/PeopleAltRounded'
import PublicIcon from '@material-ui/icons/PublicRounded'
import SpecialFolderIcon from '@material-ui/icons/FolderSpecialRounded'

// only for testing
import config from '../config'

const menu = [
  {id: 'workspaces', label: 'My Workspaces', icon: <MyIcon />, caret: true },
  {id: 'home', label: 'Home', level: 2, icon: <FolderIcon />, caret: true},
  {id: 'genome_groups', label: 'Genome Groups', level: 3, icon: <SpecialFolderIcon />},
  {id: 'feature_groups', label: 'Feature Groups', level: 3, icon: <SpecialFolderIcon />},
  {id: 'experiements', label: 'Experiment Groups', level: 3, icon: <SpecialFolderIcon />},
  {id: 'shared_with_me', label: 'Shared with Me', icon: <SharedIcon />},
  {id: 'Public_workspaces', label: 'Public Workspaces', icon: <PublicIcon />}
]

type Props = {
  onChange: (string) => void
}

const WSSideBar = (props: Props) => {

  const [value, setValue] = useState('workspaces')

  const handleChange = (newVal) => {
    setValue(newVal)
    props.onChange(newVal)
  }

  return (
    <SidebarRoot>
      <h3>
        Workspaces
        <sup>
          <P3Link
            href={`${config.p3URL}/workspace/${useParams().path}`}
            target="_blank"
          >
            <InfoIcon />
          </P3Link>
        </sup>
      </h3>

      <Menu>
        {menu.map((item) => (
          <li key={item.id}>
            <MenuItem
              level={item.level}
              caret={item.caret}
              className={item.id == value ? 'active no-style' : 'no-style hover'}
              onClick={() => handleChange(value)}
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

  li {
    padding: 5px 0;
  }
`
const indention = 8

const MenuItem = styled.a`
  display: flex;
  align-items: center;
  width: 100%;

  ${props => props.level &&
    `padding-left: ${props.level * indention + (!props.caret ? 21 : 0)};`}

  ${props => props.level &&
    `font-size: .9em`}
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
