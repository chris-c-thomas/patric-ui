/* eslint-disable react/display-name */
import React, {useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import FilterSidebar from '../../FilterSidebar'
import Table from '../../../tables/Table'
import ErrorMsg from '../../../ErrorMsg'
import Actions from './Actions'

import { Root, GridContainer, Progress} from '../TabLayout'
import { TabContext } from '../TabContext'

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
  { label: 'Pubmed', id: 'pmid', sortable: false, width: '8%' },
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

].map(o =>
  ({label: columns.filter(obj => obj.id == o.id)[0].label, ...o})
)

const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)


export default function SpecGenes() {
  const [state] = useContext(TabContext)

  const {
    init, taxonID, data, loading, error, filter, onFacetFilter,
    ...tableProps // see TabContext for rest of table params
  } = state

  const [showActions, setShowActions] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)

  useEffect(() => {
    init(core, columnIDs)
  }, [init])

  const onSelect = (rows) => {
    setShowActions(!!rows.ids.length)
  }

  return (
    <Root>
      <FilterSidebar
        core={core}
        taxonID={taxonID}
        filters={filters}
        onChange={onFacetFilter}
        collapsed={fullWidth}
        onCollapse={val => setFullWidth(val)}
        facetQueryStr={filter}
      />

      <GridContainer fullWidth={fullWidth}>
        {loading && <Progress />}

        {data && !error &&
          <Table
            columns={columns}
            rows={data}
            onSelect={onSelect}
            checkboxes
            pagination
            enableTableOptions
            openFilters={fullWidth}
            onOpenFilters={() => setFullWidth(false)}
            middleComponent={showActions && <Actions />}
            {...tableProps}
          />
        }

        {error && <ErrorMsg error={error} />}
      </GridContainer>
    </Root>
  )
}





