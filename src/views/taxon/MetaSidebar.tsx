import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

import MetaTable from './MetaTable'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))




export default function MetaSidebar(props) {
  const {genomeID} = props

  const [title, setTitle] = useState()

  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(genomeID ? true : false)
  }, [genomeID])

  const handleLoaded = (data) => {
    setTitle(data.genome_name)
  }

  const toggleDrawer = (open) => {
    setOpen(open)
  }


  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <Root>

        <div className="flex space-between">
          <h3 className="secondary">
            {title}
          </h3>
          <IconButton size="small" onClick={() => toggleDrawer(false)}>
            <CloseIcon/>
          </IconButton>
        </div>

        <MetaTable genomeID={genomeID} title={false} onLoaded={handleLoaded} />

      </Root>
    </Slide>
  )

}


const Root = styled.div`
  position: fixed;
  overflow-y: scroll;
  background: #fff;
  right: 0;
  box-shadow: -2px 4px 5px 1px #f2f2f2;
  z-index: 200;
  max-width: 350px;
  border-left: 1px solid #e9e9e9;
  padding: 10px;

  font-size: .9em;
`

const Container = styled.div`
  overflow: scroll;
`
