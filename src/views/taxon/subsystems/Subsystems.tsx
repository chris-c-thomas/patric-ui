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





