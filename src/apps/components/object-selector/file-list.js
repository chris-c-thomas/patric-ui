import React, {Fragment, useEffect, useState} from 'react';
import clsx from 'clsx';

import Table from '@material-ui/core/Table';
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

import BreadCrumbs from '../../../utils/ui/breadcrumbs';
import {bytesToSize, toDateTimeStr} from '../../../utils/units';
import * as WS from '../../../api/workspace-api';


const columns = [
  {
    id: 'name',
    label: 'Name',
  }, {
    id: 'size',
    label: 'Size',
    format: val => bytesToSize(val)
  },
  {
    id: 'owner',
    label: 'Owner',
    format: val => val.split('@')[0]
  },
  {
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
  btn: {
    padding: 0,
    minWidth: 'inherit'
  },
  emptyFolder: {
    padding: '200px 0 !important',
    textAlign: 'center'
  },
  tableWrapper: {
    maxHeight: 'calc(100% - 100px)',
    overflow: 'auto',
  }
}));


function getIcon(type) {
  if (type == 'folder')
    return <span className="icon"><Folder /></span>;
  else if (type == 'contigs') {
    //<span style={{paddingLeft: `${24}px`}}><img src={Contigs} style={{height: '10px'}}/></span>;
    return <span style={{paddingLeft: `${24}px`}}><File /></span>
  } else {
    return <span style={{paddingLeft: `${24}px`}}><File /></span>
  }
}

/**
 * Recursive helper to build a file list view
 * Note: should be used within a table
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
          <TableCell colSpan="3">
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

function getParentPath(path) {
  const parts = path.split('/');
  return parts.slice(0, parts.length - 1).join('/')
}

export default function FileList(props) {
  const styles = useStyles();
  const {type, onSelect, noBreadCrumbs} = props;

  const [path, setPath] = useState(props.path);
  const [objs, setObjs] = useState(null);

  console.log('HERE!')
  console.log('thePath is ', path)

  useEffect(() => {
    setObjs(null)
    console.log('getting path', path)
    WS.list({path})
      .then(data => {
        console.log('data', data)
        setObjs(data)
      })
  }, [props.path])

  function navigate(path) {
    setPath(path);
  }

  function select(path) {
    if (onSelect) onSelect(path);
  }

  function backDir() {
    setPath(getParentPath(path))
  }

  function getLevel() {
    return path.split('/').length - 1;
  }



  return (
    <div>
      {
        !noBreadCrumbs &&
        <BreadCrumbs path={path} onNavigate={navigate}/>
      }

      <br />

      <div className={styles.tableWrapper}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* if not top level, include parent folder button,  */
              getLevel() > 1 &&
              <TableRow onDoubleClick={backDir}>
                <TableCell colSpan="100%">
                  <IconButton onClick={backDir} size="small">
                    <ArrowBack/>
                  </IconButton>
                  {' '}<a onClick={backDir}>Parent</a>
                </TableCell>
              </TableRow>
            }

            {
              objs &&
              <FileListRecursive
                objects={objs}
                onNavigate={navigate}
                allowedType={type}
                onSelect={select}
              />
            }

            {/* if folder is emtpy */
              objs && objs.length == 0 &&
              <TableRow className="no-hover">
                <TableCell colSpan="100%" className={styles.emptyFolder}>
                  This folder is empty
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}