
import React, {useState, useEffect} from 'react'
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import LinearProgress from '@material-ui/core/LinearProgress'

import Table from '../../../tables/Table'
import { listData } from '../../../api/data-api'
import {toPrettyDate} from '../../../utils/dates'

import ErrorMsg from '../../../ErrorMsg'
import Actions from './actions'

import FilterSidebar from '../../filter-sidebar'

const core = 'genome'

const columns = [
  {
    type: 'text',
    id: 'genome_name',
    label: 'Genome Name',
    format: (_, row) =>
      <Link to={`/genome/${row.genome_id}/overview`}>{row.genome_name}</Link>,
    width: '20%'
  },
  {type: 'number', id: 'genome_id', label: 'Genome ID', width: '9%'},
  {type: 'text', id: 'genome_status', label: 'Genome Status', width: '8%'},
  {
    type: 'number', id: 'contigs', label: 'Contigs',
    format: (v, row) =>
      <Link to={`/genome/${row.genome_id}/sequences`}>{v}</Link>,
  }, {
    type: 'number', id: 'patric_cds', label: 'Patric CDS',
    format: (v, row) =>
      <Link to={`/genome/${row.genome_id}/sequences`}>{v}</Link>,
  },
  {type: 'text', id: 'isolation_country', label: 'Isolation Country'},
  {type: 'text', id: 'host_name', label: 'Host Name', width: '15%' },
  {type: 'number', id: 'collection_year', label: 'Collection Year'},
  {
    type: 'date',
    id: 'completion_date',
    label: 'Completion Date',
    format: v => toPrettyDate(v)
  },

  // hide the following
  {type:'text', id: 'public', label: 'Public', hide: true},
  {type:'text', id: 'reference_genome', label: 'Reference', hide: true},
  {type:'text', id: 'owner', label: 'Owner', hide: true},
  {type:'text', id: 'members', label: 'Members (shared with)', hide: true},
  {type:'text', id: 'taxon_id', label: 'NCBI Taxon ID', hide: true},
  {type:'text', id: 'genome_length', label: 'Size', hide: true},
  {type:'text', id: 'chromosomes', label: 'Chromosome', hide: true},
  {type:'text', id: 'plasmids', label: 'Plasmids', hide: true},
  {type:'text', id: 'refseq_cds', label: 'RefSeq CDS', hide: true},
  {type:'text', id: 'disease', label: 'Disease', hide: true},
  {type:'text', id: 'collection_date', label: 'Collection Date', hide: true},
  {type:'text', id: 'mlst', label: 'MLST', hide: true},
  {type:'text', id: 'other_typing', label: 'Other Typing', hide: true},
  {type:'text', id: 'strain', label: 'Strain', hide: true},
  {type:'text', id: 'serovar', label: 'Serovar', hide: true},
  {type:'text', id: 'biovar', label: 'Biovar', hide: true},
  {type:'text', id: 'pathovar', label: 'Pathovar', hide: true},
  {type:'text', id: 'culture_collection', label: 'Culture Collection', hide: true},
  {type:'text', id: 'type_strain', label: 'Type Strain', hide: true},
  {type:'text', id: 'sequencing_centers', label: 'Sequencing Center', hide: true},
  {type:'text', id: 'publication', label: 'Publication', hide: true},
  {type:'text', id: 'bioproject_accession', label: 'BioProject Accession', hide: true},
  {type:'text', id: 'biosample_accession', label: 'BioSample Accession', hide: true},
  {type:'text', id: 'assembly_accession', label: 'Assembly Accession', hide: true},
  {type:'text', id: 'genbank_accessions', label: 'GenBank Accessions', hide: true},
  {type:'text', id: 'refseq_accessions', label: 'RefSeq Accessions', hide: true},
  {type:'text', id: 'sequencing_status', label: 'Sequencing Status', hide: true},
  {type:'text', id: 'sequencing_platform', label: 'Sequencing Platform', hide: true},
  {type:'text', id: 'sequencing_depth', label: 'Sequencing Depth', hide: true},
  {type:'text', id: 'assembly_method', label: 'Assembly Method', hide: true},
  {type:'text', id: 'gc_content', label: 'GC Content', hide: true},
  {type:'text', id: 'isolation_site', label: 'Isolation Site', hide: true},
  {type:'text', id: 'isolation_source', label: 'Isolation Source', hide: true},
  {type:'text', id: 'isolation_comments', label: 'Isolation Comments', hide: true},
  {type:'text', id: 'geographic_location', label: 'Geographic Location', hide: true},
  {type:'text', id: 'latitude', label: 'Latitude', hide: true},
  {type:'text', id: 'longitude', label: 'Longitude', hide: true},
  {type:'text', id: 'altitude', label: 'Altitude', hide: true},
  {type:'text', id: 'depth', label: 'Depth', hide: true},
  {type:'text', id: 'other_environmental', label: 'Other Environmental', hide: true},
  {type:'text', id: 'host_gender', label: 'Host Gender', hide: true},
  {type:'text', id: 'host_age', label: 'Host Age', hide: true},
  {type:'text', id: 'host_health', label: 'Host Health', hide: true},
  {type:'text', id: 'body_sample_site', label: 'Body Sample Site', hide: true},
  {type:'text', id: 'body_sample_subsite', label: 'Body Sample Subsite', hide: true},
  {type:'text', id: 'other_clinical', label: 'Other Clinical', hide: true},
  {type:'text', id: 'antimicrobial_resistance', label: 'Antimicrobial Resistance', hide: true},
  {type:'text', id: 'antimicrobial_resistance_evidence', label: 'Antimicrobial Resistance Evidence', hide: true},
  {type:'text', id: 'gram_stain', label: 'Gram Stain', hide: true},
  {type:'text', id: 'cell_shape', label: 'Cell Shape', hide: true},
  {type:'text', id: 'motility', label: 'Motility', hide: true},
  {type:'text', id: 'sporulation', label: 'Sporulation', hide: true},
  {type:'text', id: 'temperature_range', label: 'Temperature Range', hide: true},
  {type:'text', id: 'optimal_temperature', label: 'Optimal Temperature', hide: true},
  {type:'text', id: 'salinity', label: 'Salinity', hide: true},
  {type:'text', id: 'oxygen_requirement', label: 'Oxygen Requirement', hide: true},
  {type:'text', id: 'habitat', label: 'Habitat', hide: true},
  {type:'text', id: 'comments', label: 'Comments', hide: true},
  {type:'text', id: 'additional_metadata', label: 'Additional Metadata', hide: true},
  {type:'text', id: 'date_inserted', label: 'Date Inserted', hide: true},
  {type:'text', id: 'date_modified', label: 'Date Modified', hide: true},
  {type:'text', id: 'genome_quality', label: 'Genome Quality', hide: true},
  {type:'text', id: 'genome_quality_flags', label: 'Genome Quality Flags', hide: true},
  {type:'text', id: 'coarse_consistency', label: 'Coarse Consistency', hide: true},
  {type:'text', id: 'fine_consistency', label: 'Fine Consistency', hide: true},
  {type:'text', id: 'checkm_completeness', label: 'CheckM Completeness', hide: true},
  {type:'text', id: 'checkm_contamination', label: 'CheckM Contamination', hide: true}
]

export {columns}

let filters =  [
  {id: 'public', hideSearch: true},
  {id: 'genome_status',  hideSearch: true},
  {id: 'reference_genome',  hideSearch: true},
  {id: 'antimicrobial_resistance'},
  {id: 'isolation_country'},
  {id: 'host_name'},
  {id: 'collection_year'},
  {id: 'genome_quality'}
].map(o =>
  ({label: columns.filter(obj => obj.id == o.id)[0].label, ...o})
)

const _initialColumns = columns.filter(obj => !obj.hide)
const columnIDs = _initialColumns.map(obj => obj.id)



export default function Genomes() {
  const {taxonID} = useParams()

  const history = useHistory()
  const params = new URLSearchParams(useLocation().search)

  const sort = params.get('sort') || '-score'
  const page = params.get('page') || 0
  const query = params.get('query') || ''
  const limit = params.get('limit') || 200
  const filter = params.get('filter') || ''

  const [colIDs, setColIDs] = useState(columnIDs)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [total, setTotal] = useState(null)
  const [error, setError] = useState(null)

  const [showActions, setShowActions] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)


  useEffect(() => {
    const params = {
      core,
      sort,
      start: page * limit,
      limit,
      query,
      eq: {taxon_lineage_ids: taxonID},
      filter,
      select: colIDs
    }

    setLoading(true)
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
    // todo: work on selection
    setShowActions(true)
  }


  return (
    <Root>
              {loading && <Progress />}
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


        {data &&
          <Table
            columns={columns}
            rows={data}
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
  display: flex;
  max-height: calc(100% - 150px);
  height: 100%;
`

const GridContainer = styled.div`
  position: relative;
  margin: 0 10px;
  width: calc(100% - ${(props) => props.fullWidth ? '5px' : '270px'} );

  @media (max-width: 960px) {
    width: calc(100% - 2px);
  }
`

const Progress = styled(LinearProgress)`
  position: absolute;
  top: 0;
`


