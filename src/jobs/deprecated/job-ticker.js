import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import Badge from '@material-ui/core/Badge'
import QueuedIcon from '@material-ui/icons/PlaylistAddRounded'
import InProgressIcon from '@material-ui/icons/PlaylistPlayRounded'
import CompletedIcon from '@material-ui/icons/PlaylistAddCheckRounded'


import { JobStatusContext} from '../JobStatusContext'

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    bottom: 0,
    right: '40px',
    background: '#333',
    color: '#fff',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    display: 'inline',
    zIndex: 9999
  },
  title: {
    paddingTop: '7px'
  },
  icon: {
    fontSize: '2em'
  }
})


export default function JobsTicker(props) {
  const styles = useStyles()

  const [state] = useContext(JobStatusContext)

  return (
    <div className={styles.root}>
      <Box display="flex" component={Link} to="/jobs">
        <Box m={1} className={styles.title}>
          Jobs
        </Box>

        <Box m={1}>
          <Tooltip title={`${state.queued} queued jobs`}>
            <Badge badgeContent={state.queued} max={999999} color="primary">
              <QueuedIcon className={styles.icon}/>
            </Badge>
          </Tooltip>
        </Box>

        <Box m={1}>
          <Tooltip title={`${state.inProgress} in-progress jobs`}>
            <Badge badgeContent={state.inProgress} max={999999} color="primary">
              <InProgressIcon className={styles.icon} />
            </Badge>
          </Tooltip>
        </Box>

        <Box m={1}>
          <Tooltip title={`${state.completed} completed jobs`}>
            <Badge badgeContent={state.completed} max={999999} color="primary">
              <CompletedIcon className={styles.icon}/>
            </Badge>
          </Tooltip>
        </Box>
      </Box>
    </div>
  )
}