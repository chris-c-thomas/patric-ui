import React, {useState, useEffect, useContext } from 'react'
import {useParams} from 'react-router-dom'

import FilterSidebar from './FilterSidebar'
import Table from '../tables/Table'
import ErrorMsg from '../ErrorMsg'
import { TabContext } from './TabContext'

// Note: we'lll likely want to push these components
// higher in the file tree to 'views'
import MetaSidebar from './taxon/MetaSidebar'
import { Root, GridContainer, Progress} from './taxon/TabLayout'

import useLocalStorage from '../hooks/useLocalStorage'


type Props = {
  core: string           // this is the solr core
  columns: object[]      // specification of columns
  columnIDs: string[]    // default columns to show (initially)
  filters: object[]      // specification of filters
  Actions: React.FC      // actions (component)
}

export default function SolrGrid(props: Props) {
  const {
    core,
    columns,
    columnIDs,
    filters,
    Actions
  } = props

  let {taxonID, genomeID} = useParams()
  const [state] = useContext(TabContext)

  const {
    init, data, loading, error, onFacetFilter,
    ...tableProps // see TabContext for rest of table params
  } = state

  const [showDetails, setShowDetails] = useLocalStorage('uiSettings', 'showDetails')
  const [showFilters, setShowFilters] = useLocalStorage('uiSettings', 'showFilters')
  const [selection, setSelection] = useState(null)

  useEffect(() => {
    init(core, columnIDs, taxonID, genomeID)
  }, [init, core, columnIDs, taxonID, genomeID])

  const onSelect = (sel) => {
    setSelection(sel.objs.length ? sel.objs : null)
  }

  return (
    <Root>
      <FilterSidebar
        core={core}
        filters={filters}
        onChange={onFacetFilter}
        collapsed={!showFilters}
        onCollapse={val => setShowFilters(!val)}
        applyOption
      />

      <GridContainer fullWidth={!showFilters}>
        {loading && <Progress />}

        {data && !error &&
          <Table
            columns={columns}
            rows={data}
            onSelect={onSelect}
            checkboxes
            pagination
            enableTableOptions
            openFilters={!showFilters}
            onOpenFilters={() => setShowFilters(!showFilters)}
            middleComponent={selection && <Actions />}
            onShowDetails={() => setShowDetails(prev => !prev)}
            {...tableProps}
          />
        }

        {error && <ErrorMsg error={error} />}
      </GridContainer>

      {showDetails &&
        <MetaSidebar
          selection={selection}
          onClose={() => setShowDetails(false)}
        />
      }
    </Root>
  )
}