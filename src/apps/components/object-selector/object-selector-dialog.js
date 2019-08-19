import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import FolderIcon  from '@material-ui/icons/FolderOpen';
import MyIcon from '@material-ui/icons/AccountCircleOutlined';
import SharedIcon from '@material-ui/icons/PeopleOutline';
import PublicIcon from '@material-ui/icons/PublicOutlined';

import WSGrid from './object-selector-grid';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}


function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  dialog: {
    minHeight: '80vh',
    maxHeight: '80vh',
  },
  tabRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab: {
    overflow: 'scroll',
    width: '100%'
  }
}));



export default function ObjectSelectorDialog(props) {
  const styles = useStyles();

  const {type} = props;

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const [tab, setTab] = useState(0);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function onTabChange(event, newValue) {
    setTab(newValue);
  }

  return (
    <div>
      <Button color="primary" onClick={handleClickOpen} disableRipple>
        <FolderIcon />
      </Button>
      <Dialog
        className={styles.dialog}
        fullWidth
        maxWidth={"xl"}
        fullScreen={fullScreen}
        open={true}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Select a contig"}
        </DialogTitle>

        <DialogContent className={styles.tabRoot}>
          <Tabs
            orientation="vertical"
            value={tab}
            onChange={onTabChange}
            aria-label="Vertical tabs example"
            className={styles.tabs}
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

          <TabPanel value={tab} index={0} className={styles.tab}>
            <WSGrid type={type}/>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            Shared with me
          </TabPanel>
          <TabPanel value={tab} index={2}>
            Public
          </TabPanel>
          <TabPanel value={tab} index={3}>
            Sample Data
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" disableRipple>
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" disableRipple autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
