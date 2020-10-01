/* eslint-disable react/display-name */
import React, {useState, useEffect, useContext } from 'react'

import FilterSidebar from '../../FilterSidebar'
import Table from '../../../tables/Table'
import ErrorMsg from '../../../ErrorMsg'
import Actions from './Actions'

import { Root, GridContainer, Progress} from '../TabLayout'
import { getFilterSpec } from '../TabUtils'
import { TabContext } from '../../TabContext'
import MetaSidebar from '../MetaSidebar'

import columns from './columns'

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
  const [state] = useContext(TabContext)

  const {
    init, data, loading, error, onFacetFilter,
    ...tableProps // see TabContext for rest of table params
  } = state

  const [showActions, setShowActions] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)
  const [genomeID, setGenomeID] = useState(null)

  useEffect(() => {
    init(core, columnIDs)
  }, [init])

  const onSelect = (rows) => {
    setShowActions(!!rows.ids.length)

    if (rows.objs.length == 1)
      setGenomeID(rows.objs[0].genome_id)
    else
      setGenomeID(null)
  }

  return (
    <Root>
      <FilterSidebar
        core={core}
        filters={filters}
        onChange={onFacetFilter}
        collapsed={fullWidth}
        onCollapse={val => setFullWidth(val)}
        applyOption
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
            onShowDetails={genomeID && <MetaSidebar genomeID={genomeID} />}
            {...tableProps}
          />
        }

        {error && <ErrorMsg error={error} />}
      </GridContainer>

    </Root>
  )
}



