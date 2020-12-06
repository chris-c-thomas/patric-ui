import React from 'react'

import SolrGrid from '../../SolrGrid'
import Actions from './Actions'

import { getFilterSpec } from '../TabUtils'
import columns from './genomeColumns'


const core = 'genome'

let filters =  [
  {id: 'public', hideSearch: true, hideSelectAll: true},
  {id: 'genome_status',  hideSearch: true},
  {id: 'reference_genome',  hideSearch: true},
  {id: 'antimicrobial_resistance'},
  {id: 'isolation_country'},
  {id: 'host_name'},
  {id: 'collection_year'},
  {id: 'genome_quality'}
]

filters = getFilterSpec(filters, columns)

const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)


export default function Genomes() {
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



