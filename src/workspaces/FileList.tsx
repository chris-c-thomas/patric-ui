/* eslint-disable react/display-name */
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Table from '../tables/Table'

import Folder from '@material-ui/icons/FolderOutlined'
import File from '@material-ui/icons/InsertDriveFileOutlined'
import WSIcon from '../../assets/icons/hdd-o.svg'
import WSSharedIcon from '../../assets/icons/shared-workspace.svg'
import GroupIcon from '../../assets/icons/genome-group.svg'
import FeaturesIcon from '../../assets/icons/genome-features.svg'
import ContigsIcon from '../../assets/icons/contigs.svg'
import JobResultIcon from '@material-ui/icons/FlagRounded'

import {bytesToSize, isoToHumanDateTime} from '../utils/units'


const getColumns = (onNavigate, isObjSelector) => [
  {
    id: 'name',
    label: 'Name',
    width: '45%',
    format: (val, obj) => (
      isObjSelector && obj.type != 'folder' ?
        <span className="inline-flex align-items-center">
          {getIcon(obj)} {val}
        </span> :
        <Link
          to={obj.type == 'job_result' ?
            `/job-result${obj.encodedPath}` :
            `/files${obj.encodedPath}`
          }
          onClick={evt => onNavigate(evt, obj)}
          className="inline-flex align-items-center"
        >
          {getIcon(obj)} {val}
        </Link>
    )
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
    return <img src={ContigsIcon} className="icon" style={{fill: '#000'}}/>
  else if (type == 'genome_group')
    return <img src={GroupIcon} className="icon"/>
  else if (type == 'feature_group')
    return <img src={FeaturesIcon} className="icon"/>
  else if (type == 'job_result')
    return <JobResultIcon className="icon" />
  else
    return <File className="icon"/>
}




type Props = {
  rows: object[]
  viewType?: 'jobResult' | 'objectSelector'

  // for object selector
  fileType?: string
  onSelect: (obj: object) => void
  onNavigate: (evt: MouseEvent, obj: object) => void
}


export default function FileList(props: Props) {
  const {
    rows,
    viewType,
    fileType,
    onSelect,
    onNavigate,
  } = props


  // if object selector, we'll want to use a
  // click event instead of routing
  const [columns] = useState(getColumns(onNavigate, viewType == 'objectSelector'))

  // additional conditions for object selector
  let params = {}
  if (viewType == 'objectSelector') {
    params['greyRow'] = (row) => {
      return row.type != 'folder' && row.type != fileType
    }

    params['disableRowSelect'] = (row) => {
      return row.type != fileType
    }
  }


  const handleSelect = (state) => {
    if (onSelect) onSelect(state)
  }

  const handleDoubleClick = (evt, obj) => {
    if (onNavigate) onNavigate(evt, obj)
  }

  return (
    <>
      {rows &&
        <Table
          offsetHeight={viewType == 'jobResult' && '210px'}
          columns={columns}
          rows={rows}
          onSelect={handleSelect}
          onDoubleClick={handleDoubleClick}
          emptyNotice="This folder is empty."
          stripes={false}
          {...params}
        />
      }
    </>
  )
}