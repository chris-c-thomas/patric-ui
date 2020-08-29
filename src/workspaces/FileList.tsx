/* eslint-disable react/display-name */
import React, {useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom'

import Table from '../tables/table'

import Folder from '@material-ui/icons/FolderOutlined'
// import ArrowDown from '@material-ui/icons/ArrowDropDown'
// import ArrowBack from '@material-ui/icons/ArrowBack'
import File from '@material-ui/icons/InsertDriveFileOutlined'

import {bytesToSize, toDateTimeStr} from '../utils/units'
import * as WS from '../api/workspace'


const columns = [
  {
    id: 'name',
    label: 'Name',
    width: '50%',
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
    format: val => toDateTimeStr(val)
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
  fileType?: string;
  noBreadCrumbs?: boolean;
  isObjectSelector?: boolean;
  path?: string;
  onSelect: () => void;
}

export default function FileList(props: Props) {
  const {fileType, noBreadCrumbs, isObjectSelector, onSelect} = props

  let urlPathParam = useParams().path

  let path
  if (isObjectSelector) {
    path = props.path

    // if object selector, we'll want to use a click event instead of routing system
    columns[0].format = (val, obj) =>
      <a onClick={() => onClick(obj)}>{getIcon(obj.type)} {val}</a>
  } else {
    path = '/' + decodeURIComponent(urlPathParam)
  }

  const [rows, setRows] = useState(null)

  useEffect(() => {
    setRows(null)
    WS.list({path})
      .then(data => {
        setRows(data)
      })
  }, [path])

  // use event for object select
  const onClick = (obj) => {
    alert(JSON.stringify(obj, null, 4))
  }

  const onDoubleClick = () => {
    console.log('double click')
  }

  return (
    <>
      {
        rows &&
        <Table
          columns={columns}
          rows={rows}
          onDoubleClick={onDoubleClick}
        />
      }
    </>
  )
}