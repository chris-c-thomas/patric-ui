import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import QueuedIcon from '@material-ui/icons/PlaylistAddRounded';
import InProgressIcon from '@material-ui/icons/PlaylistPlayRounded';
import CompletedIcon from '@material-ui/icons/PlaylistAddCheckRounded';

import { getStatus } from '../api/app-service-api';

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
    position: 'fixed',
    zIndex: 9999
  },
  title: {
    paddingTop: '7px'
  },
  icon: {
    fontSize: '2em'
  }
});


export default function SignInDialog(props) {
  const styles = useStyles();

  const [status, setStatus] = useState({
    queued: '',
    inProgress: '',
    completed: '...'
  });

  useEffect(() => {
    getStatus().then(status => {
      const queued = status.queued || 0,
            inProgress = status['in-progress'] || 0,
            completed = status.completed || 0;

      setStatus({queued, inProgress, completed})
    })
  }, [])

  return (
    <div className={styles.root}>
      <Box display="flex" component={Link} to="/jobs" className="no-style">
        <Box m={1} className={styles.title}>
          Jobs
        </Box>

        <Box m={1}>
          <Tooltip title={`${status.queued} queued jobs`}>
            <Badge badgeContent={status.queued} max={999999} color="primary">
              <QueuedIcon className={styles.icon}/>
            </Badge>
          </Tooltip>
        </Box>

        <Box m={1}>
          <Tooltip title={`${status.inProgress} in-progress jobs`}>
            <Badge badgeContent={status.inProgress} max={999999} color="primary">
              <InProgressIcon className={styles.icon} />
            </Badge>
          </Tooltip>
        </Box>

        <Box m={1}>
          <Tooltip title={`${status.completed} completed jobs`}>
            <Badge badgeContent={status.completed} max={999999} color="primary">
              <CompletedIcon className={styles.icon}/>
            </Badge>
          </Tooltip>
        </Box>
      </Box>
    </div>
  );
}