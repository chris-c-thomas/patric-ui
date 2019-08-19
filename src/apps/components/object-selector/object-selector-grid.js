import React, {useEffect, useState} from 'react';

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Folder from '@material-ui/icons/FolderOutlined';
import File from '@material-ui/icons/InsertDriveFileOutlined';
import ArrowBack from '@material-ui/icons/ArrowBackIos'


import BreadCrumbs from './breadcrumbs';
import {bytesToSize, toDateTimeStr} from '../../../utils/units';
import * as WS from '../../../api/workspace-api';


const useStyles = makeStyles({
  folder: {
    width: '1%',
    padding: '12px 0'
  },
  disabled: {
    color: '#aaa'
  }
});


function FileList(props) {
  const styles = useStyles();
  const {objects, allowedType} = props;
  const {onSelect} = props;

  const [selectedPath, setSelectedPath] = useState(null);

  function onNav(path) {
    props.onNavigate(path);
  }

  function selectPath(path) {
    setSelectedPath(path);
    if (onSelect) onSelect(path);
  }

  return objects.map((obj, i) => {
    const {type, name, path} = obj;
    const disabled = type != 'folder' && type != allowedType;

    return (
      <tr onClick={() => {if (type != 'folder' && type == allowedType) selectPath(path);}}
        onDoubleClick={() => {if (type == 'folder') onNav(path)}}
        key={i}
        className={`${disabled ? styles.disabled : ''} ${path == selectedPath ? 'selected' : ''}`}
      >
        <td className={styles.folder}>{type == 'folder' ? <Folder /> : <File />}</td>
        <td>
          {
            type == 'folder' ?
            <a onClick={() => onNav(path)}>{name}</a> : name
          }
        </td>
        <td>{type == 'folder' ? '-' : bytesToSize(obj.size)}</td>
        <td>{obj.owner.split('@')[0]}</td>
        <td>{toDateTimeStr(obj.created)}</td>
      </tr>
    )
  })
}


export default function ObjectSelectorGrid(props) {
  const {type} = props;

  const [objs, setObjs] = useState(null);
  const [path, setPath] = useState('/nconrad@patricbrc.org/home');

  useEffect(() => {
    console.log('listing new path', path)
    WS.list({path})
      .then((data) => {
        setObjs(data)
      })
  }, [path])

  function navigate(path) {
    setPath(path);
  }

  function back(path) {

  }

  return (
    <div>
      <BreadCrumbs path={path} onNavigate={navigate}/>

      {/*<Button><ArrowBack /> Back</Button>*/}
      <br />
      <table className="basic hover">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Size</th>
            <th>Owner</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {
            objs &&
            <FileList objects={objs} onNavigate={navigate} allowedType={type}/>
          }
        </tbody>
      </table>
      </div>
  )

}