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
  const [state] = useContext(TabContext)
  const {
    init, data, loading, error, filter, onFacetFilter,
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





