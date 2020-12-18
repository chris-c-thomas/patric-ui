/* eslint-disable react/display-name */
import React from 'react'
import { Link } from 'react-router-dom'

import SolrGrid from '../../SolrGrid'
import Actions from './Actions'

import { getFilterSpec } from '../TabUtils'

const core = 'genome_sequence'

const columns = [
  { label: 'Sequence ID', id: 'sequence_id', hide: true },
  { label: 'Genome Name', id: 'genome_name', width: '20%',
    format: (_, row) => <Link to={`/genome/${row.genome_id}/overview`}>{row.genome_name}</Link>
  },
  { label: 'Genome ID', id: 'genome_id' },
  { label: 'Accession', id: 'accession'},
  { label: 'Length (bp)', id: 'length'},
  { label: 'GC Content %', id: 'gc_content'},
  { label: 'Sequence Type', id: 'sequence_type'},
  { label: 'Topology', id: 'topology'},
  { label: 'Description', id: 'description', width: '35%'}
]

export {columns}

let filters =  [
  {id: 'sequence_type' },
  {id: 'topology' },
]

filters = getFilterSpec(filters, columns)



const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)


export default function Sequences() {
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





