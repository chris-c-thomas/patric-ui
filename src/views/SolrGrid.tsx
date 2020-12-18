import React, {useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
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

import DownloadBtn from './DownloadBtn'
import {downloadTable} from '../api/data-api'




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

  const {taxonID, genomeID} = useParams()
  const [state] = useContext(TabContext)

  const {
    init, data, loading, error, onFacetFilter, filterState,
    ...tableProps // see TabContext for rest of table params
  } = state

  const [showDetails, setShowDetails] = useLocalStorage('uiSettings', 'showDetails')
  const [showFilters, setShowFilters] = useLocalStorage('uiSettings', 'showFilters')
  const [selection, setSelection] = useState(null)

  useEffect(() => {
    init(core, columnIDs, taxonID, genomeID)
  }, [init, core, columnIDs, taxonID, genomeID])


  const handleSelect = (sel) => {
    setSelection(sel.objs.length ? sel.objs : null)
  }

  const handleDownload = (type) => {
    downloadTable(core, taxonID, type, 'genome_id', filterState.filterString)
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
            onSelect={handleSelect}
            checkboxes
            pagination
            enableTableOptions
            openFilters={!showFilters}
            onOpenFilters={() => setShowFilters(!showFilters)}
            rightComponent={<DownloadBtn onDownload={handleDownload} />}
            middleComponent={selection && <Actions selection={selection} />}
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


