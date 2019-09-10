import React, {Fragment, useEffect, useState} from 'react';
import clsx from 'clsx';

import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Folder from '@material-ui/icons/FolderOutlined';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowDown from '@material-ui/icons/ArrowDropDown';
import ArrowBack from '@material-ui/icons/ArrowBack';
import File from '@material-ui/icons/InsertDriveFileOutlined';
// import Contigs from '../../../../assets/icons/ws/contigs.svg';

import BreadCrumbs from './breadcrumbs';
import {bytesToSize, toDateTimeStr} from '../../../utils/units';
import * as WS from '../../../api/workspace-api';


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
function FileList(props) {
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
        <tr
          onClick={() => (type != 'folder' && type == allowedType) && selectPath(path)}
          onDoubleClick={() => type == 'folder' && onNav(path)}
          className={clsx(disabled && styles.disabled, {selected: path == selectedPath}, disabled && 'no-hover')}
        >
          <td colSpan="3">
            <span style={{paddingLeft: level ? `${24 * level}px` : ''}}>
              {
                type == 'folder' &&
                <IconButton onClick={() => expand(obj)} className={styles.btn} aria-label="expand">
                  {obj.open ? <ArrowDown /> : <ArrowRight />}
                </IconButton>
              }

              {getIcon(type)}

              {' '}

              {
                type == 'folder' ? <a onClick={() => onNav(path)}>{name}</a> : name
              }
            </span>
          </td>

          <td>{type == 'folder' ? '-' : bytesToSize(obj.size)}</td>
          <td>{obj.owner.split('@')[0]}</td>
          <td>{toDateTimeStr(obj.created)}</td>
        </tr>

        {
          obj.children &&
          <FileList
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

export default function ObjectSelectorGrid(props) {
  const styles = useStyles();
  const {type, onSelect} = props;

  const [path, setPath] = useState(props.path || '/nconrad@patricbrc.org/home');
  const [objs, setObjs] = useState(null);

  useEffect(() => {
    setObjs(null)
    WS.list({path})
      .then((data) => {
        setObjs(data)
      })
  }, [path])

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
      <BreadCrumbs path={path} onNavigate={navigate}/>

      <br />
      <table className="simple hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Owner</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {/* if not top level, include parent folder button,  */
             getLevel() > 1 &&
            <tr onDoubleClick={backDir}>
              <td colSpan="100%">
                <IconButton onClick={backDir} size="small">
                  <ArrowBack/>
                </IconButton>
                {' '}<a onClick={backDir}>Parent</a>
              </td>
            </tr>
          }

          {
            objs &&
            <FileList
              objects={objs}
              onNavigate={navigate}
              allowedType={type}
              onSelect={select}
            />
          }

          {/* if folder is emtpy */
            objs && objs.length == 0 &&
            <tr className="no-hover">
              <td colSpan="100%" className={styles.emptyFolder}>
                This folder is empty
              </td>
            </tr>
          }
        </tbody>
      </table>
      </div>
  )

}