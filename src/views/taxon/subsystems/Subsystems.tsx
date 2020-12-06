/* eslint-disable react/display-name */
import React from 'react'
import { Link } from 'react-router-dom'

import SolrGrid from '../../SolrGrid'
import Actions from './Actions'

import { getFilterSpec } from '../TabUtils'

const core = 'subsystem'

const columns = [
  { label: 'Superclass', id: 'superclass' },
  { label: 'Class', id: 'class' },
  { label: 'Subclass', id: 'subclass' },
  { label: 'Subsystem Name', id: 'subsystem_name' },
  { label: 'Genome Count', id: 'genome_count' },
  { label: 'Gene Count', id: 'gene_count' },
  { label: 'Role Count', id: 'role_count' },
  { label: 'Variant', id: 'active', hide: true },
  { label: 'Subsystem ID', id: 'subsystem_id', hide: true }
]

export {columns}

let filters =  [
  {id: 'superclass' },
  {id: 'class' },
  {id: 'subclass' },
  {id: 'active' },
]

filters = getFilterSpec(filters, columns)


const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)


export default function Subsystems() {
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





