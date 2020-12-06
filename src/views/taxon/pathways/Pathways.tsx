/* eslint-disable react/display-name */
import React from 'react'
import { Link } from 'react-router-dom'

import SolrGrid from '../../SolrGrid'
import Actions from './Actions'

import { getFilterSpec } from '../TabUtils'

const core = 'pathway'

const columns = [
  { label: 'Index', id: 'idx', hide: true },
  { label: 'Pathway ID', id: 'pathway_id', width: '5%'},
  { label: 'Pathway Name', id: 'pathway_name' },
  { label: 'Pathway Class', id: 'pathway_class' },
  { label: 'Annotation', id: 'annotation', width: '5%'},
  { label: 'EC Number', id: 'ec_number', width: '8%'},
  { label: 'Description', id: 'ec_description', width: '20%' }
]

export {columns}

let filters =  [
  {id: 'annotation' },
  {id: 'pathway_class' },
]

filters = getFilterSpec(filters, columns)


const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)


export default function Pathways() {
  return (
    <SolrGrid
      core={core}
      columns={columns}
      columnIDs={columnIDs}
      filters={filters}
      Actions={Actions}
    />
  )
}





