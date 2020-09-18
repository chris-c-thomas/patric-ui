import React, {useState, useEffect, createContext} from 'react'
import {useParams, useHistory, useLocation} from 'react-router-dom'

import { listData, getGenomeIDs, getRepGenomeIDs } from '../../api/data-api'

const MAX_GENOMES = 20000

const LOG = false

const TabContext = createContext([null])

const TabProvider = (props) => {
  const {taxonID} = useParams()

  const history = useHistory()
  const params = new URLSearchParams(useLocation().search)

  const sort = params.get('sort') || '-score'
  const page = params.get('page') || 0
  const query = params.get('query') || ''
  const limit = params.get('limit') || 100
  const filter = params.get('filter') || ''

  const [core, setCore] = useState(null)
  const [colIDs, setColIDs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(null)
  const [error, setError] = useState(null)

  const [filterStr, setFilterStr] = useState(null)

  // Keep an object version of filter state in memory
  // This is not currently used, but may be?
  const [filterState, setFilterState] = useState(null)

  useEffect(() => {
    (async function() {
      // core may not be set yet
      if (!core) return

      const params = {
        core,
        sort,
        start: Number(page) * Number(limit),
        limit,
        query,
        filter: filterStr,
        select: colIDs,
        eq: null
      }

      // if core is genome, go ahead and make query with taxon_lineage_ids
      if (core == 'genome') {
        params.eq = {taxon_lineage_ids: taxonID}

      // if core is not 'genome', get associated genome ids first
      } else {
        const genomeIDs = await getGenomeIDs(taxonID)

        // if associated genomes ids is over MAX_GENOMES,
        // get representative genomes instead
        if (genomeIDs.length > MAX_GENOMES) {
          const repGenomeIDs = await getRepGenomeIDs(taxonID)
          params.eq = {genome_id: repGenomeIDs}
        } else {
          params.eq = {genome_id: genomeIDs}
        }
      }

      if (LOG)
        console.log('fetching data for:', params)

      setError(null)
      setLoading(true)
      try {
        let res = await listData(params)
        res = res.data.response
        let data = res.docs
        setTotal(res.numFound)
        setData(data)

        setLoading(false)
      } catch(e) {
        setLoading(false)
        setError(e)
      }
    })()

    return () => {
      // cancel request!
    }
  }, [core, taxonID, sort, page, query, colIDs, filterStr, limit])

  const init = (core, columnIDs) => {
    setCore(core)
    setColIDs(columnIDs)
  }

  const onSort = (sortStr) => {
    params.set('sort', sortStr)
    history.push({search: params.toString()})
  }

  const onPage = (page) => {
    params.set('page', page)
    history.push({search: params.toString()})
  }

  const onSearch = ({query}) => {
    if (!query) params.delete('query')
    else params.set('query', `*${query}*`)

    history.push({search: params.toString()})
  }

  const onFacetFilter = (state, queryStr) => {
    setFilterStr(queryStr)
    setFilterState(state)
    if (!queryStr.length) params.delete('filter')
    else params.set('filter', queryStr)

    // note: we don't want to escape parens and commas for rql
    history.push({search: unescape(params.toString())})
  }

  const onColumnMenuChange = (cols) => {
    console.log('setting new ids', cols)
    setColIDs(cols.map(col => col.id))
  }


  return (
    <TabContext.Provider value={[{
      init, loading, data, filter: filterStr, filterState, error, total, taxonID, page, limit, sort, query,
      onSort, onPage, onSearch, onFacetFilter, onColumnMenuChange,
      emptyNotice: loading && 'loading...'
    }]}>
      {props.children}
    </TabContext.Provider>
  )
}

export { TabContext, TabProvider }