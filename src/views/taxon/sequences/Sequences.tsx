/* eslint-disable react/display-name */
import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'

import FilterSidebar from '../../FilterSidebar'
import Table from '../../../tables/Table'
import ErrorMsg from '../../../ErrorMsg'
import Actions from './Actions'

import { Root, GridContainer, Progress} from '../TabLayout'
import { getFilterSpec } from '../TabUtils'
import { TabContext } from '../../TabContext'

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
  const [state] = useContext(TabContext)
  const {
    init, data, loading, error, onFacetFilter,
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
        filters={filters}
        onChange={onFacetFilter}
        collapsed={fullWidth}
        onCollapse={val => setFullWidth(val)}
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





