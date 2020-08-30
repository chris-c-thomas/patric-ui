/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react'
import { Link, useHistory } from 'react-router-dom'

import Table from '../tables/Table'

import Folder from '@material-ui/icons/FolderOutlined'
// import ArrowDown from '@material-ui/icons/ArrowDropDown'
// import ArrowBack from '@material-ui/icons/ArrowBack'
import File from '@material-ui/icons/InsertDriveFileOutlined'

import {bytesToSize, isoToHumanDateTime} from '../utils/units'
import * as WS from '../api/workspace'


const columns = [
  {
    id: 'name',
    label: 'Name',
    width: '45%',
    format: (val, obj) =>
      <Link to={(`/files${obj.encodedPath}`)}>{getIcon(obj.type)} {val}</Link>
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
    format: val => isoToHumanDateTime(val)
  }
]


function getIcon(type) {
  if (type == 'folder')
    return <Folder />
  else if (type == 'contigs')
    return <File />
  else
    return <File />
}

function getParentPath(path) {
  const parts = path.split('/')
  return parts.slice(0, parts.length - 1).join('/')
}


type Props = {
  wsPath: string;
  fileType?: string;
  isObjectSelector?: boolean;
  onSelect: (obj: object) => void;
}


export default function FileList(props: Props) {
  const {wsPath, fileType, isObjectSelector, onSelect} = props

  if (fileType) {
    // pass
  }

  const history = useHistory()
  const [path, setPath] = useState(wsPath)

  useEffect(() => {
    setPath(wsPath)
  }, [wsPath])

  if (isObjectSelector) {
    // if object selector, we'll want to (somehow) use a
    // click event instead of routing
    columns[0].format = (val, obj) =>
      <a onClick={() => navigate(obj)}>{getIcon(obj.type)} {val}</a>
  }

  const [rows, setRows] = useState(null)

  useEffect(() => {
    setRows(null)
    WS.list({path,})
      .then(data => {
        console.log('data', data)
        setRows(data)
      })
  }, [path])

  // use event for object select
  const handleSelect = (state) => {
    if (onSelect) onSelect(state)
  }

  const navigate = (obj) => {
    if (isObjectSelector) return
    history.push(`/files${obj.encodedPath}`)
  }

  return (
    <>
      {
        rows &&
        <Table
          columns={columns}
          rows={rows}
          onClick={handleSelect}
          onDoubleClick={navigate}
        />
      }
    </>
  )
}