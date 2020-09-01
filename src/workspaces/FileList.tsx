/* eslint-disable react/display-name */
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

import Table from '../tables/Table'

import Folder from '@material-ui/icons/FolderOutlined'
// import ArrowDown from '@material-ui/icons/ArrowDropDown'
// import ArrowBack from '@material-ui/icons/ArrowBack'
import File from '@material-ui/icons/InsertDriveFileOutlined'
import WSIcon from '../../assets/icons/hdd-o.svg'
import WSSharedIcon from '../../assets/icons/shared-workspace.svg'

import {bytesToSize, isoToHumanDateTime} from '../utils/units'


const columns = [
  {
    id: 'name',
    label: 'Name',
    width: '45%',
    format: (val, obj) =>
      <Link to={(`/files${obj.encodedPath}`)}>{getIcon(obj)} {val}</Link>
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


function getIcon({type, isWS, permissions}) {
  if (isWS && permissions.length > 1)
    return <img src={WSSharedIcon} className="icon"/>
  else if (isWS)
    return <img src={WSIcon} className="icon"/>
  else if (type == 'folder')
    return <Folder className="icon" />
  else if (type == 'contigs')
    return <File className="icon"/>
  else
    return <File className="icon"/>
}


/* probably not even needed
function getParentPath(path) {
  const parts = path.split('/')
  return parts.slice(0, parts.length - 1).join('/')
}
*/


type Props = {
  rows: object[];
  fileType?: string;
  isObjectSelector?: boolean;
  onSelect: (obj: object) => void;
  onNavigate: (obj: object) => void;
}


export default function FileList(props: Props) {
  const {
    rows,
    fileType,
    isObjectSelector,
    onSelect,
    onNavigate
  } = props

  if (fileType) {
    // pass
  }

  if (isObjectSelector) {
    // if object selector, we'll want to (somehow) use a
    // click event instead of routing
    columns[0].format = (val, obj) =>
      <a onClick={() => navigate(obj)}>{getIcon(obj.type)} {val}</a>
  }

  // use event for object select
  const handleSelect = (state) => {
    if (onSelect) onSelect(state)
  }

  const navigate = (obj) => {
    if (isObjectSelector) return
    if (onNavigate) onNavigate(obj)
  }



  return (
    <>
      {
        rows &&
        <Table
          columns={columns}
          rows={rows}
          onSelect={handleSelect}
          onDoubleClick={navigate}
        />
      }
    </>
  )
}