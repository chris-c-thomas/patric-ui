import React, {useState, useEffect, createContext, useReducer} from 'react'
import {useParams, useHistory, useLocation} from 'react-router-dom'

import { listData, getGenomeIDs, getRepGenomeIDs } from '../api/data-api'

import parseQuery from './parseQuery'

import filterReducer from './filterReducer'
import buildFilterString from './buildFilterString'


const MAX_GENOMES = 20000

const LOG = false

const TabContext = createContext([null])

const TabProvider = (props) => {
  let {taxonID, genomeID} = useParams()

  const history = useHistory()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
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

  // keep track of genomeIDs for facet filtering
  const [genomeIDs, setGenomeIDs] = useState(null)

  const [filterState, dispatch] = useReducer(filterReducer, null, () => {
    const {byCategory, range} = parseQuery(filter)
    return {
      byCategory,
      range,
      filterString: buildFilterString(byCategory, range)
    }
  })

  // update filterState whenever url state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const filter = params.get('filter') || ''

    dispatch({type: 'URL_CHANGE', value: filter})
  }, [location])


  useEffect(() => {
    const queryStr = filterState.filterString

    if (!queryStr.length) params.delete('filter')
    else params.set('filter', queryStr)

    // note: we don't want to escape parens and commas for rql
    history.push({search: unescape(params.toString())})
  }, [filterState.filterString])


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
        filter: filterState.filterString,
        select: colIDs,
        eq: null
      }

      // if core is genome, go ahead and make query with taxon_lineage_ids
      if (core == 'genome') {
        params.eq = {taxon_lineage_ids: taxonID || genomeID}

      // if core is not genome and we're in taxon view, get associated genome ids first
      // Todo(nc): this should only happn on first request!
      } else if (core !== 'genome' && !genomeID) {
        const genomeIDs = await getGenomeIDs(taxonID)

        // if associated genomes ids is over MAX_GENOMES,
        // get representative genomes instead
        if (genomeIDs.length > MAX_GENOMES) {
          const repGenomeIDs = await getRepGenomeIDs(taxonID)
          params.eq = {genome_id: repGenomeIDs}
          setGenomeIDs(repGenomeIDs)
        } else {
          params.eq = {genome_id: genomeIDs}
          setGenomeIDs(genomeIDs)
        }

      // if genomeID, filter to just that genome
      } else if (genomeID) {
        params.eq = {genome_id: genomeID}
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
  }, [core, taxonID, genomeID, sort, page, query, colIDs, limit, filterState.filterString])



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

  const onColumnMenuChange = (cols) => {
    setColIDs(cols.map(col => col.id))
  }


  return (
    <TabContext.Provider value={[{
      init, loading, data, genomeIDs, filterState, error, total, page, limit, sort, query,
      onSort, onPage, onSearch, onColumnMenuChange,
      emptyNotice: loading && 'loading...'
    }, dispatch]}>
      {props.children}
    </TabContext.Provider>
  )
}


export { TabContext, TabProvider }

