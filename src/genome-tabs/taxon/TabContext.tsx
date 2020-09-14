import React, {useState, useEffect, createContext} from 'react'
import {useParams, useHistory, useLocation} from 'react-router-dom'

import { listData, getGenomeIDs, getRepGenomeIDs } from '../../api/data-api'

const MAX_GENOMES = 20000


const TabContext = createContext([{
  init: null,
  loading: null,
  data: null,
  filter: null,
  error: null,
  total: null,
  taxonID: null,
  page: null,
  limit: null,
  sort: null,
  query: null,
  onSort: null,
  onPage: null,
  onSearch: null,
  onFacetFilter: null,
  onColumnMenuChange: null
}])

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
  const [loading, setLoading] = useState(null)
  const [data, setData] = useState(null)
  const [total, setTotal] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      // core may not be set yet
      if (!core) return

      const params = {
        core,
        sort,
        start: Number(page) * Number(limit),
        limit,
        query,
        filter,
        select: colIDs,
        eq: null
      }

      // if core is not 'genome', get associated genome ids first
      if (core == 'genome') {
        params.eq = {taxon_lineage_ids: taxonID}
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

      console.log('fetching data for:', params)
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
    }

    fetchData()

    return () => {
      // cancel request!
    }
  }, [core, taxonID, sort, page, query, colIDs, filter, limit])

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

  const onFacetFilter = (queryObj, queryStr) => {
    if (!queryStr.length) params.delete('filter')
    params.set('filter', queryStr)

    // note: we don't want to escape parens and commas for rql
    history.push({search: unescape(params.toString())})
  }

  const onColumnMenuChange = (cols) => {
    setColIDs(cols.map(col => col.id))
  }


  return (
    <TabContext.Provider value={[{
      init, loading, data, filter, error, total, taxonID, page, limit, sort, query,
      onSort, onPage, onSearch, onFacetFilter, onColumnMenuChange
    }]}>
      {props.children}
    </TabContext.Provider>
  )
}

export { TabContext, TabProvider }