import React from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import Public from '@material-ui/icons/PublicRounded';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FolderIcon from '@material-ui/icons/FolderOutlined';
import FolderFav from '@material-ui/icons/FolderSpecialRounded';
import FolderShared from '@material-ui/icons/FolderSharedRounded';

// import AddWSIcon from '../../assets/icons/ws/add-workspace.svg';
// import SharedWSIcon from '../../assets/icons/ws/shared-workspace.svg';


import {getUser} from '../api/auth';

const useTreeItemStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    '&:focus > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    marginRight: 10
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const subTreeStyles = {
  paddingLeft: '15px'
}

const user = getUser();
const myWorkspace = `/${user}@patricbrc.org/`;
const genomeGroups = `/${user}@patricbrc.org/home/Genome Groups/`;
const featureGroups = `/${user}@patricbrc.org/home/Feature Groups/`;
const expGroups = `/${user}@patricbrc.org/home/Experiment Groups/`;

export default function WSTree(props) {
  const classes = useStyles();
  const {counts} = props;

  return (
    <TreeView
      className={classes.root}
      defaultExpanded={['1', '2']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
    >
      <StyledTreeItem nodeId="1" labelText="My Workspaces" labelIcon={FolderOpenIcon} component={Link} to="/files/">

        <StyledTreeItem nodeId="2" labelText="Home" labelIcon={FolderIcon}>
          <StyledTreeItem
            nodeId="4"
            labelText="Genome Groups"
            labelIcon={FolderFav}
            labelInfo={counts && `${counts[genomeGroups]}`}
            color="#1a73e8"
            bgColor="#e8f0fe"
            style={subTreeStyles}
            component={Link}
            to={`/files/${genomeGroups}`}
          />
          <StyledTreeItem
            nodeId="5"
            labelText="Feature Groups"
            labelIcon={FolderFav}
            labelInfo={counts && `${counts[featureGroups]}`}
            color="#e3742f"
            bgColor="#fcefe3"
            style={subTreeStyles}
            to={`/files/${featureGroups}`}
          />
          <StyledTreeItem
            nodeId="6"
            labelText="Experiment Groups"
            labelIcon={FolderFav}
            labelInfo={counts && `${counts[expGroups]}`}
            color="#a250f5"
            bgColor="#f3e8fd"
            style={subTreeStyles}
            to={`/files/${expGroups}`}
          />
        </StyledTreeItem>

      </StyledTreeItem>

      <StyledTreeItem nodeId="3" labelText="Public Workspaces" labelIcon={Public} />
    </TreeView>
  );
}