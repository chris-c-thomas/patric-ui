import React from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import InfoIcon from '@material-ui/icons/InfoOutlined'

// only for testing
import config from '../config'


type Props = {
  onChange: () => void
}

const WSSideBar = (props: Props) => {

  const handleChange = () => {
    alert('Need to implement')
    props.onChange()
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

      <div>
        <Tabs
          orientation="vertical"
          value={0}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Workspaces" disableRipple/>
          <Tab label="Home" disableRipple />
          <Tab label="Genome Groups" disableRipple/>
        </Tabs>
      </div>
    </SidebarRoot>
  )
}

const sidebarWidth = '200px'

const SidebarRoot = styled.div`
  width: ${sidebarWidth};
  padding: 5px 10px;
  border-right: 1px solid #ccc;

  .MuiTab-wrapper {
    display: inline-block;
  }
`

const P3Link = styled.a`
  svg { font-size: 1.25em; }
`



export {sidebarWidth}

export default WSSideBar
