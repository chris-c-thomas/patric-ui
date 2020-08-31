import React, { useState } from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import FolderIcon  from '@material-ui/icons/FolderOutlined'
import MyIcon from '@material-ui/icons/AccountCircleOutlined'
import SharedIcon from '@material-ui/icons/PeopleOutline'
import PublicIcon from '@material-ui/icons/PublicOutlined'

// import { ButtonGroup } from '@material-ui/core';
// import NavNextIcon from '@material-ui/icons/NavigateNextRounded';
// import NavBeforeIcon from '@material-ui/icons/NavigateBeforeRounded';

import * as Auth from '../../../api/auth'

import FileList from '../../../workspaces/FileList'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  )
}


function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

export default function ObjectSelectorDialog(props) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const path = `/${Auth.getUser()}@patricbrc.org/home`

  const {title, type} = props

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [selectedPath, setSelectedPath] = useState(null)


  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function onTabChange(event, newValue) {
    setTab(newValue)
  }

  function onSelect(path) {
    setSelectedPath(path)

    // callback for setting input box
    props.onSelect(path)
  }

  // could implment history here, if desired.
  function prev() {}
  function next() {}

  return (
    <>
      <FolderBtn color="primary" onClick={handleClickOpen}
        disableRipple
      >
        <FolderIcon />
      </FolderBtn>

      <DialogRoot
        className="dialog"
        fullWidth
        maxWidth={'xl'}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {/*<ButtonGroup size="small" aria-label="table paging" disableRipple>
            <Button onClick={() => back} disabled={!prev.length}><NavBeforeIcon /></Button>
            <Button disabled={!next.length}><NavNextIcon /></Button>
            </ButtonGroup>  {' '} */}
          {title}
        </DialogTitle>

        <DialogContent className="dialog-content">
          <Tabs
            orientation="vertical"
            value={tab}
            onChange={onTabChange}
            aria-label="Workspace tabs"
            className="tabs"
          >
            <Tab
              label={<span><MyIcon/>My files</span>}
              {...a11yProps(0)}
              disableRipple
            />
            <Tab
              label={<span><SharedIcon/>Shared with me</span>}
              {...a11yProps(1)}
              disableRipple
            />
            <Tab
              label={<span><PublicIcon/>Public</span>}
              {...a11yProps(2)}
              disableRipple
            />
            <Tab label="Sample Data" {...a11yProps(3)} disableRipple/>
          </Tabs>

          <TabPanel value={tab} index={0} className="tab">
            <FileList
              type={type}
              onSelect={onSelect}
              isObjectSelector
              wsPath={path}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            Shared with me
          </TabPanel>
          <TabPanel value={tab} index={2}>
          </TabPanel>
          <TabPanel value={tab} index={3}>
            Sample Data
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" disableRipple autoFocus>
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained" disableRipple disabled={!selectedPath}>
            OK
          </Button>
        </DialogActions>

      </DialogRoot>
    </>
  )
}


const DialogRoot = styled(Dialog)`
  .dialog-content {
    display: flex;
  }

  .tabs {
    border-right: 1px solid #aaa;
  }

  .tab {
    width: 100%;
  }
`

const FolderBtn = styled(Button)`
  &.MuiButton-root {
    min-width: 0;
    margin-left: 2px;
  }
`
