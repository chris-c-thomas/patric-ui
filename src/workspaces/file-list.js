import React, {Fragment, useEffect, useState} from 'react';
import clsx from 'clsx';
import { Link, useParams } from "react-router-dom";

import Table from '../tables/table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Folder from '@material-ui/icons/FolderOutlined';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowDown from '@material-ui/icons/ArrowDropDown';
import ArrowBack from '@material-ui/icons/ArrowBack';
import File from '@material-ui/icons/InsertDriveFileOutlined';
// import Contigs from '../../../../assets/icons/ws/contigs.svg';

import {bytesToSize, toDateTimeStr} from '../utils/units';
import * as WS from '../api/workspace';


const columns = [
  {
    id: 'name',
    label: 'Name',
    width: '50%',
    format: (val, obj) =>
      <>
        {
          <Link to={(`/files${obj.encodedPath}`)}>{getIcon(obj.type)} {val}</Link>
        }
      </>,
  }, {
    id: 'size',
    label: 'Size',
    format: (val, obj) => obj.type == 'folder' ? '-' : bytesToSize(obj.size)
  }, {
    id: 'owner',
    label: 'Owner',
    format: val => val.split('@')[0]
  }, {
    id: 'permissions',
    label: 'Members',
    format: (perms, obj) => obj.public ?
      'Public' : (perms.length == 1 ? 'Only me' : `${perms.length} members`)
  }, {
    id: 'created',
    label: 'Created',
    format: val => toDateTimeStr(val)
  }
]


const useStyles = makeStyles(theme => ({
  spacer: {
    width: '24px' // size of caret button
  },
  icon: {
    marginTop: '10px'
  },
  disabled: {
    color: '#aaa'
  },
  emptyFolder: {
    padding: '200px 0 !important',
    textAlign: 'center'
  },
  btn: {
    padding: 0,
    minWidth: 'inherit'
  },
  tableWrapper: {
    maxHeight: 'calc(100% - 100px)',
    overflow: 'auto',
  }
}));


function getIcon(type) {
  if (type == 'folder')
    return <Folder />
  else if (type == 'contigs')
    return <File />
  else
    return <File />
}

function getParentPath(path) {
  const parts = path.split('/');
  return parts.slice(0, parts.length - 1).join('/')
}


function EmptyFolder(props) {
  const {styles} = props;
  return (
    <TableRow className="no-hover">
      <TableCell colSpan="100%" className={styles.emptyFolder}>
        This folder is empty
      </TableCell>
    </TableRow>
    )
}

/**
 * Recursive helper to build a file list view
 * Note: should be used within a table (see below)
 * @param {*} props
 */
function FileListRecursive(props) {
  const styles = useStyles();
  const {allowedType, onSelect, level = 0} = props;

  const [objects, setObjects] = useState(props.objects)
  const [selectedPath, setSelectedPath] = useState(null);

  // this may be an anti-pattern,
  // but let's use the last opened/close path for state
  const [togglePath, setTogglePath] = useState([null, false]);

  // on expand, fetch data and add to 'children'
  useEffect(() => {
    const [path, open] = togglePath;
    if (!path) return;

    if (open) openChild(path)
    else closeChild(path)
  }, [togglePath])


  function openChild(path) {
    WS.list({path})
      .then(data => {
        // edit object to include children
        setObjects(prev => {
          return prev.map(o => {
            if (o.path != path) return o;
            o.children = data;
            o.open = true;
            return o;
          })
        })
      })
  }

  function closeChild(path) {
    setObjects(prev => {
      return prev.map(o => {
        if (o.path != path) return o;
        o.children = null;
        o.open = false;
        return o;
      })
    })
  }

  function onNav(path) {
    if (props.onNavigate)
      props.onNavigate(path);
  }

  function selectPath(path) {
    setSelectedPath(path);
    if (onSelect) onSelect(path);
  }

  function expand(obj) {
    setTogglePath([obj.path, !obj.open])
  }

  return objects.map((obj, i) => {
    const {type, name, path} = obj;
    const disabled = type != 'folder' && type != allowedType;

    return (
      <Fragment key={i}>
        <TableRow
          onClick={() => (type != 'folder' && type == allowedType) && selectPath(path)}
          onDoubleClick={() => type == 'folder' && onNav(path)}
          className={clsx(disabled && styles.disabled, {selected: path == selectedPath}, disabled && 'no-hover')}
        >
          <TableCell>
            <span style={{paddingLeft: level ? `${24 * level}px` : ''}}>
              {
                type == 'folder' &&
                <IconButton
                  className={styles.btn}
                  onClick={() => expand(obj)}
                  className={styles.btn}
                  aria-label="expand">
                    {obj.open ? <ArrowDown /> : <ArrowRight />}
                </IconButton>
              }

              {getIcon(type)}

              {' '}

              {
                type == 'folder' ? <a onClick={() => onNav(path)}>{name}</a> : name
              }
            </span>
          </TableCell>

          <TableCell>{type == 'folder' ? '-' : bytesToSize(obj.size)}</TableCell>
          <TableCell>{obj.owner.split('@')[0]}</TableCell>
          <TableCell>{toDateTimeStr(obj.created)}</TableCell>
        </TableRow>

        {
          obj.children &&
          <FileListRecursive
            objects={obj.children}
            allowedType={allowedType}
            level={level + 1}
          />
        }
      </Fragment>
    )
  })
}

export default function FileList(props) {
  const styles = useStyles();
  const {type, onSelect, noBreadCrumbs, isObjectSelector} = props;

  let path
  if (isObjectSelector) {

  } else {
    let urlPathParam = useParams().path;
    path = '/' + decodeURIComponent(urlPathParam)
  }

  const [rows, setRows] = useState(null);

  useEffect(() => {
    console.log('new path', path)
    setRows(null)
    WS.list({path})
      .then(data => {
        setRows(data)
      })
  }, [path])


  const onDoubleClick = () => {
    console.log('double click')
  }

  return (
    <div>
      {/*
        !noBreadCrumbs &&
        <BreadCrumbs path={path} onNavigate={navigate}/>
      */}

      <div className={styles.tableWrapper}>
        {
          rows &&
          <Table
            offsetHeight="80px"
            columns={columns}
            rows={rows}
            onDoubleClick={onDoubleClick}
          />
        }
      </div>
    </div>
  )
}