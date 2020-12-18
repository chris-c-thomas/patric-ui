import React, {useState, useEffect, createContext, useReducer, useMemo, useLayoutEffect} from 'react'
import {useHistory, useLocation} from 'react-router-dom'

import { listData, getGenomeIDs, getRepGenomeIDs } from '../api/data-api'

import parseQuery from './parseQuery'

import filterReducer from './filterReducer'
import buildFilterString from './buildFilterString'


const MAX_GENOMES = 20000

const LOG = false

// todo(nc): document
const isStateUpToDate = (filterStr, urlStr) =>
  (!filterStr && !urlStr) || (decodeURIComponent(filterStr) == decodeURIComponent(urlStr))


const TabContext = createContext([null])


// hook for fetching genome ids (for when not viewing genome core)
function useGenomeIDs(core: string, taxonID: string) {
  const [state, setState] = useState({core, taxonID})
  const [genomeIDs, setGenomeIDs] = useState(null)


  useEffect(() => {
    setState({core, taxonID})
  }, [core, taxonID])


  useEffect(() => {
    let active = true

    async function fetchGenomeIDs() {
      const {core, taxonID} = state

      // if genome core, we don't have to fetch anything
      if (!core || core == 'genome' || !taxonID) return

      const genomeIDs = await getGenomeIDs(taxonID)

      // if associated genomes ids is over MAX_GENOMES,
      // get representative genomes instead
      let ids = genomeIDs
      if (ids.length > MAX_GENOMES) {
        ids = await getRepGenomeIDs(taxonID)
      }

      if (active)
        setGenomeIDs(ids)
    }

    fetchGenomeIDs()

    return () => { active = false }
  }, [state])

  return genomeIDs
}


function TabProvider(props) {
  const history = useHistory()
  const location = useLocation()

  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const sort = params.get('sort') || '-score'
  const page = params.get('page') || 0
  const query = params.get('query') || ''
  const limit = params.get('limit') || 100
  const filter = params.get('filter') || ''

  const [core, setCore] = useState(null)
  const [colIDs, setColIDs] = useState(null)
  const [taxonID, setTaxonID] = useState(null)
  const [genomeID, setGenomeID] = useState(null)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(null)
  const [error, setError] = useState(null)


  // keep track of genomeIDs to "join" on the genome core
  const genomeIDs = useGenomeIDs(core, taxonID)


  const [filterState, dispatch] = useReducer(filterReducer, null, () => {
    const {byCategory, range} = parseQuery(filter)

    return {
      byCategory,
      range,
      filterString: buildFilterString(byCategory, range)
    }
  })


  // effect for updating URL on filterString change
  useEffect(() => {
    const filterStr = filterState.filterString

    if (isStateUpToDate(filterStr, params.get('filter'))) {
      return
    }

    if (!filterStr.length) params.delete('filter')
    else params.set('filter', filterStr)

    // note: we don't want to escape parens and commas for rql
    history.push({search: unescape(params.toString())})

  }, [filterState.filterString])



  // effect for setting state on filter change
  useEffect(() => {
    const {byCategory, range} = parseQuery(filter)
    const filterString = buildFilterString(byCategory, range)

    if (filterString == filterState.filterString) {
      return
    }

    dispatch({type: 'SET', value: {byCategory, range, filterString}})
  }, [filter])



  // effect for fetching grid data
  useEffect(() => {
    let active = true

    async function fetch() {
      // if core is not genome and we don't have genomeIDs yet,
      // there's nothing to do
      if (!core || (core !== 'genome' && !genomeIDs) || !taxonID)
        return

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

      // if not looking at genome core, we'll need to filter on genomeIDs (rep genomeids if max is met)
      } else if (genomeIDs) {
        params.eq = {genome_id: genomeIDs}

      // if genomeID, filter to just that genome
      } else if (genomeID) {
        params.eq = {genome_id: genomeID}
      }

      if (LOG) console.log('fetching data for:', params)

      setError(null)
      setLoading(true)
      try {
        let res = await listData(params)
        res = res.data.response
        let data = res.docs

        if (!active) return
        setTotal(res.numFound)
        setData(data)
        setLoading(false)
      } catch(e) {
        if (!active) return
        setLoading(false)
        setError(e)
      }
    }

    setData([])
    fetch()

    return () => { active = false }
  }, [
    core, colIDs, taxonID, genomeID, sort, page, query, limit,
    filterState.filterString, genomeIDs
  ])



  const init = (core, columnIDs, taxonID, genomeID) => {
    setCore(core)
    setColIDs(columnIDs)
    setTaxonID(taxonID)
    setGenomeID(genomeID)
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

