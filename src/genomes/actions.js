

import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import GroupIcon from '@material-ui/icons/CollectionsBookmarkOutlined'


const useStyles = makeStyles(theme => ({
  btn: {
    color: '#fff'
  }
}));


export default function Actions({open}) {
  const styles = useStyles();

  const [show, setShow] = useState(open);

  useEffect(() => {
    setShow(open);
  }, [open])

  return (
    <div className="action-drawer-container" style={{'display': open ? 'block' : 'none'}}>
      <div className="action-drawer">
      <Button className={styles.btn} disableRipple>
        <GroupIcon /><br/>
        Group
      </Button>
      </div>

    </div>
  )
}
