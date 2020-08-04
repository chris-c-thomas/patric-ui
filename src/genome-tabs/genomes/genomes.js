
import React, {useState, useEffect} from 'react'
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import LinearProgress from '@material-ui/core/LinearProgress'

import Table from '../../tables/table'
import { listData } from '../../api/data-api'
import {toPrettyDate} from '../../utils/dates'

import ErrorMsg from '../../error-msg'
import Actions from './actions'



const columns = [
  {
    type: 'text',
    id: 'genome_name',
    label: 'Genome Name',
    format: (_, row) => <Link to={`/genome/${row.genome_id}`}>{row.genome_name}</Link>,
    width: '25%'
  },
  {type: 'number', id: 'genome_id', label: 'Genome ID'},
  {type: 'text', id: 'genome_status', label: 'Genome Status'},
  {type: 'number', id: 'contigs', label: 'Contigs'},
  {type: 'number', id: 'patric_cds', label: 'Patric CDS'},
  {type: 'text', id: 'isolation_country', label: 'Isolation Country'},
  {type: 'text', id: 'host_name', label: 'Host Name', width: '10%' },
  {type: 'number', id: 'collection_year', label: 'Collection Year'},
  {
    type: 'date',
    id: 'completion_date',
    label: 'Completion Date',
    format: v => toPrettyDate(v)
  },

  // hide the following
  {type: 'number', id: 'plasmids', hide: true},
  {type: 'text', id: 'common_name', hide: true},
  {type: 'text', id: 'isolation_comments', hide: true},
  {type: 'text', id: 'temperature_range', hide: true},
  {type: 'text', id: 'oxygen_requirement', hide: true},
  {type: 'text', id: 'owner', hide: true},
  {type: 'text', id: 'strain', hide: true},
  {type: 'text', id: 'gc_content', hide: true},
  {type: 'text', id: 'refseq_cds', hide: true},
  {type: 'text', id: 'gram_stain', hide: true},
  {type: 'text', id: 'ncbi_project_id', hide: true},
  {type: 'text', id: 'disease', hide: true},
  {type: 'text', id: 'sequencing_depth', hide: true},
  {type: 'text', id: 'organism_name', hide: true},
  {type: 'text', id: 'isolation_source', hide: true},
  {type: 'text', id: 'sequencing_centers', hide: true},
  {type: 'text', id: 'genome_length', hide: true},
  {type: 'text', id: 'cell_shape', hide: true},
  {type: 'text', id: 'comments', hide: true},
  {type: 'text', id: 'genbank_accessions', hide: true},
  {type: 'text', id: 'refseq_project_id', hide: true},
  {type: 'text', id: 'optimal_temperature', hide: true},
  {type: 'text', id: 'public', hide: true},
  {type: 'text', id: 'sequencing_status', hide: true},
  {type: 'text', id: 'p2_genome_id', hide: true},
  {type: 'text', id: 'refseq_accessions', hide: true},
  {type: 'text', id: 'sequencing_platform', hide: true},
  {type: 'text', id: 'chromosomes', hide: true},
  {type: 'text', id: 'taxon_id', hide: true},
  {type: 'text', id: 'habitat', hide: true},
  {type: 'text', id: 'taxon_lineage_ids', hide: true},
  {type: 'text', id: 'taxon_lineage_names', hide: true},
  {type: 'text', id: 'phylum', hide: true},
  {type: 'text', id: 'order', hide: true},
  {type: 'text', id: 'genus', hide: true},
  {type: 'text', id: 'species', hide: true},
  {type: 'text', id: 'kingdom', hide: true},
  {type: 'text', id: 'class', hide: true},
  {type: 'text', id: 'family', hide: true},
  {type: 'text', id: 'date_inserted', hide: true},
  {type: 'text', id: 'date_modified', hide: true},
  {type: 'text', id: 'bioproject_accession', hide: true},
  {type: 'text', id: 'biosample_accession', hide: true},
  {type: 'text', id: 'assembly_accession', hide: true},
  {type: 'text', id: 'plfam_cds', hide: true},
  {type: 'text', id: 'partial_cds', hide: true},
  {type: 'text', id: 'cds', hide: true},
  {type: 'text', id: 'contig_l50', hide: true},
  {type: 'text', id: 'hypothetical_cds', hide: true},
  {type: 'text', id: 'trna', hide: true},
  {type: 'text', id: 'rrna', hide: true},
  {type: 'text', id: 'cds_ratio', hide: true},
  {type: 'text', id: 'partial_cds_ratio', hide: true},
  {type: 'text', id: 'contig_n50', hide: true},
  {type: 'text', id: 'genome_quality', hide: true},
  {type: 'text', id: 'hypothetical_cds_ratio', hide: true},
  {type: 'text', id: 'plfam_cds_ratio', hide: true},
  {type: 'text', id: 'coarse_consistency', hide: true},
  {type: 'text', id: 'fine_consistency', hide: true},
  {type: 'text', id: 'checkm_completeness', hide: true},
  {type: 'text', id: 'checkm_contamination', hide: true}
]


const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)


export function Genomes() {
  const {taxonID} = useParams()

  const history = useHistory()
  const params = new URLSearchParams(useLocation().search)

  const sort = params.get('sort') || '-score'
  const page = params.get('page') || 0
  const query = params.get('query') || ''
  const limit = params.get('limit') || 200

  const [colIDs, setColIDs] = useState(columnIDs) // currently enabled columns
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [total, setTotal] = useState(null)
  const [error, setError] = useState(null)

  const [showActions, setShowActions] = useState(false)


  useEffect(() => {
    setLoading(true)

    const params = {
      sort,
      start: page * limit,
      limit,
      query,
      eq: {taxon_lineage_ids: taxonID},
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
  }, [taxonID, sort, page, query, colIDs])


  const onSort = (sortStr) => {
    params.set('sort', sortStr)
    history.push({search: params.toString()})
  }

  const onPage = (page) => {
    params.set('page', page)
    history.push({search: params.toString()})
  }

  const onSearch = ({query}) => {
    // don't search if query is null
    if (!query) params.delete('query')
    else params.set('query', `*${query}*`)

    history.push({search: params.toString()})
  }


  const onColumnChange = (col, showCol) => {
    setColIDs(prev => {
      if (showCol)
        return [...prev, col.id]

      prev.splice(prev.indexOf(col.id), 1)
      return prev
    })
  }

  const onClick = (val) => {
    setShowActions(true)
  }


  return (
    <Root>
      <GridContainer>
        {loading &&
          <Progress />
        }

        {data &&
          <Table
            pagination
            onColumnMenuChange={onColumnChange}
            page={page}
            limit={limit}
            total={total}
            checkboxes
            columns={columns}
            rows={data}
            onPage={onPage}
            onSearch={onSearch}
            onClick={onClick}
            sort={sort}
            onSort={onSort}
            enableTableOptions // filter and download
          />
        }

        {error && <ErrorMsg error={error} />}
      </GridContainer>

      <Actions open={showActions}/>
    </Root>
  )
}


const Root = styled.div`

`

const GridContainer = styled.div`
  padding: 0 10px;
  width: calc(100% - 100px);
  display: inline-block;
`

const Progress = styled(LinearProgress)`
  display: absolute;
  top: 0;
`

