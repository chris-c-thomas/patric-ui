/* eslint-disable react/display-name */
import React from 'react'
import { Link } from 'react-router-dom'

import SolrGrid from '../../SolrGrid'
import Actions from './Actions'

import { getFilterSpec } from '../TabUtils'


const core = 'genome_amr'

const columns = [
  { label: 'Genome Name', id: 'genome_name', width: '20%',
    format: (_, row) =>
      <Link to={`/genome/${row.genome_id}/overview`}>{row.genome_name}</Link>,
  },
  { label: 'Taxon ID', id: 'taxon_id', hide: true},
  { label: 'Genome ID', id: 'genome_id', hide: true },
  { label: 'Antibiotic', id: 'antibiotic',
    format: (_, row) =>
      <Link to={`/view/antibiotic/${row.antibiotic}`}>{row.antibiotic}</Link>
  },
  { label: 'Resistant Phenotype', id: 'resistant_phenotype' },
  { label: 'Measurement Sign', id: 'measurement_sign' },
  { label: 'Measurement Value', id: 'measurement_value' },
  { label: 'Measurement Units', id: 'measurement_unit' },
  { label: 'Lab typing Method', id: 'laboratory_typing_method' },
  { label: 'Lab typing Version', id: 'laboratory_typing_method_version', hide: true },
  { label: 'Lab typing Platform', id: 'laboratory_typing_platform', hide: true },
  { label: 'Lab typing Vendor', id: 'vendor', hide: true },
  { label: 'Testing standard', id: 'testing_standard', hide: true },
  { label: 'Testing standard year', id: 'testing_standard_year', hide: true },
  { label: 'Computational Method', id: 'computational_method' },
  { label: 'Computational Method Version', id: 'computational_method', hide: true },
  { label: 'Computational Method Performance', id: 'computational_method_performance', hide: true },
  { label: 'Evidence', id: 'evidence' },
  { label: 'Pubmed', id: 'pmid' }
]

let filters =  [
  //{id: 'public', hideSearch: true},
  {id: 'antibiotic'},
  {id: 'resistant_phenotype'},
  {id: 'evidence'},
  {id: 'laboratory_typing_method'},
  {id: 'computational_method'},
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





