/* eslint-disable react/display-name */
import React from 'react'
import { Link } from 'react-router-dom'

import SolrGrid from '../../SolrGrid'
import Actions from './Actions'

import { getFilterSpec } from '../TabUtils'

const core = 'genome_feature'

const columns = [
  { label: 'Genome Name', id: 'genome_name', hide: false,
    format: (_, row) =>
      <Link to={`/genome/${row.genome_id}/overview`}>{row.genome_name}</Link>,
    width: '20%'
  },
  { label: 'Genome ID', id: 'genome_id' },
  { label: 'Accession', id: 'accession', hide: true },
  { label: 'PATRIC ID', id: 'patric_id', hide: false, width: '10%'},
  { label: 'RefSeq Locus Tag', id: 'refseq_locus_tag', hide: false },
  { label: 'Alt Locus Tag', id: 'alt_locus_tag', hide: true },
  { label: 'Gene Symbol', id: 'gene', hide: false },
  { label: 'Feature ID', id: 'feature_id', hide: true },
  { label: 'Annotation', id: 'annotation', hide: true },
  { label: 'Feature Type', id: 'feature_type', hide: true },
  { label: 'Start', id: 'start', hide: true },
  { label: 'End', id: 'end', hide: true },
  { label: 'Length (NT)', id: 'na_length', hide: true },
  { label: 'Strand', id: 'strand', hide: true },
  { label: 'FIGfam ID', id: 'figfam_id', hide: true },
  { label: 'PATRIC Local Family', id: 'plfam_id' },
  { label: 'PATRIC Global Family', id: 'pgfam_id' },
  { label: 'Protein ID', id: 'protein_id', hide: true },
  { label: 'Length (AA)', id: 'aa_length', hide: true },
  { label: 'Product', id: 'product', hide: false, width: '25%' },
  { label: 'GO Terms', id: 'go', sortable: false, hide: true },
  { label: 'Classifier Score', id: 'classifier_score', hide: true },
  { label: 'Classifier Round', id: 'classifier_round', hide: true }
]

export {columns}

// ['public', 'annotation', 'feature_type'],
let filters =  [
//  {id: 'public', hideSearch: true},
  {id: 'annotation', hideSearch: true },
  {id: 'feature_type'}
]

filters = getFilterSpec(filters, columns)

const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)


export default function Features() {
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





