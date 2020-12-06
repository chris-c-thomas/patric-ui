/* eslint-disable react/display-name */
import React from 'react'
import { Link } from 'react-router-dom'

import SolrGrid from '../../SolrGrid'
import Actions from './Actions'

import { getFilterSpec } from '../TabUtils'

const core = 'sp_gene'

const columns = [
  { label: 'Evidence', id: 'evidence' },
  { label: 'Property', id: 'property' },
  { label: 'Source', id: 'source' },
  { label: 'PATRIC ID', id: 'patric_id', width: '10%',
    format: (val) =>
      <Link to={`/view/Feature/${val}`}>{val}</Link>
  },
  { label: 'RefSeq Locus Tag', id: 'refseq_locus_tag', width: '10%'},
  { label: 'Alt Locus Tag', id: 'alt_locus_tag', hide: true },
  { label: 'Source ID', id: 'source_id' },
  { label: 'Source Organism', id: 'organism', hide: true },
  { label: 'Gene', id: 'gene' },
  { label: 'Product', id: 'product', width: '25%'},
  { label: 'Function', id: 'function', hide: true },
  { label: 'Classification', id: 'classification', sortable: false, hide: true},
  { label: 'Antibiotics Class', id: 'antibiotics_class', hide: true },
  { label: 'Antibiotics', id: 'antibiotics', sortable: false, hide: true },
  { label: 'Pubmed', id: 'pmid', sortable: false, width: '12%',
    format: (val) => {
      if (!val) return null
      const str = val.join(', ')
      return <a href={`https://pubmed.ncbi.nlm.nih.gov/?term=${str}`} target="_blank" rel="noreferrer">{str}</a>
    }
  },
  { label: 'Subject Coverage', id: 'subject_coverage', hide: true },
  { label: 'Query Coverage', id: 'query_coverage', hide: true },
  { label: 'Identity', id: 'identity' },
  { label: 'E-value', id: 'e_value', }
]

export {columns}

let filters =  [
  // {id: 'public', hideSearch: true},
  {id: 'property' },
  {id: 'source' },
  {id: 'evidence' },
  {id: 'classification' },
  {id: 'antibiotics_class' },
  {id: 'antibiotics' },
]
filters = getFilterSpec(filters, columns)

const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)


export default function SpecGenes() {
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





