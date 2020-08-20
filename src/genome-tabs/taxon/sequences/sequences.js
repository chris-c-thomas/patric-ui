
import React, {useState, useEffect} from 'react'
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import LinearProgress from '@material-ui/core/LinearProgress'

import Table from '../../../tables/table'
import { listData, getGenomeIDs } from '../../../api/data-api'

import ErrorMsg from '../../../error-msg'
import Actions from './actions'

import FilterSidebar from '../../filter-sidebar'

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
  {id: 'topology' }
].map(o =>
  ({label: columns.filter(obj => obj.id == o.id)[0].label, ...o})
)

const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)



export default function Sequences() {
  const {taxonID} = useParams()

  const history = useHistory()
  const params = new URLSearchParams(useLocation().search)

  const sort = params.get('sort') || '-score'
  const page = params.get('page') || 0
  const query = params.get('query') || ''
  const limit = params.get('limit') || 200
  const filter = params.get('filter') || ''

  const [colIDs, setColIDs] = useState(columnIDs) // currently enabled columns
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [total, setTotal] = useState(null)
  const [error, setError] = useState(null)

  const [showActions, setShowActions] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)


  useEffect(() => {
    setLoading(true)

    getGenomeIDs(taxonID).then(genomeIDs => {
      const params = {
        core,
        sort,
        start: page * limit,
        limit,
        query,
        in: {genome_id: genomeIDs},
        filter,
        select: colIDs
      }
      listData(params)
        .then((res) => {
          res = res.data.response
          let data = res.docs
          setTotal(res.numFound)
          setData(data)

          setLoading(false)
        }).catch((e) => {
          setLoading(false)
          setError(e)
        })
    })

  }, [taxonID, sort, page, query, colIDs, filter])


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

  const onColumnChange = (cols) => {
    setColIDs(cols.map(col => col.id))
  }

  const onClick = (val) => {
    setShowActions(true)
  }


  return (
    <Root>
      <FilterSidebar
        core={core}
        taxonID={taxonID}
        filters={filters}
        onChange={onFacetFilter}
        collapsed={fullWidth}
        onCollapse={val => setFullWidth(val)}
        facetQueryStr={filter}
      />

      <GridContainer fullWidth={fullWidth}>
        <Progress show={loading} />

        {data &&
          <Table
            offsetHeight="210px"
            columns={columns}
            rows={data}
            pagination
            onColumnMenuChange={onColumnChange}
            page={page}
            limit={limit}
            total={total}
            sort={sort}
            search={query}
            onPage={onPage}
            onSearch={onSearch}
            onClick={onClick}
            onSort={onSort}
            checkboxes
            pagination
            enableTableOptions
            openFilters={fullWidth}
            onOpenFilters={() => setFullWidth(false)}
            MiddleComponent={() => <Actions show={showActions} />}
          />
        }

        {error && <ErrorMsg error={error} />}
      </GridContainer>
    </Root>
  )
}


const Root = styled.div`

`

const GridContainer = styled.div`
  margin: 0 10px;
  width: calc(100% - ${(props) => props.fullWidth ? '5px' : '270px'} );

  @media (max-width: 960px) {
    width: calc(100% - 2px);
  }

  display: inline-block;
`

const Progress = styled(LinearProgress)`
  visibility: ${props => props.show ? 'visible' : 'hidden'};
`


