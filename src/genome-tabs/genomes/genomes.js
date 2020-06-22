
import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

import Progress from '@material-ui/core/LinearProgress'

// import Actions from './actions'
import TableControls from '../../grids/table-controls'
import { listGenomes } from '../../api/data-api'

import Grid from '../../grids/grid'

const columnSpec = [
  {
    type: 'text',
    id: 'genome_name',
    label: 'Genome Name',
    format: (val, row) => <Link to={`/genome/${row.genome_id}`}>{row.genome_name}</Link>
  },
  {type: 'number', id: 'genome_id', label: 'Genome ID'},
  {type: 'text', id: 'genome_status', label: 'Genome Status'},
  {type: 'number', id: 'contigs', label: 'Contigs'},
  {type: 'number', id: 'patric_cds', label: 'Patric CDS'},
  {type: 'text', id: 'isolation_country', label: 'Isolation Country'},
  {type: 'text', id: 'host_name', label: 'Host Name'},
  {type: 'number', id: 'collection_year', label: 'Collection Year'},
  {type: 'date', id: 'completion_date', label: 'Completion Date', dateFormat: 'MM/DD/YYYY', correctFormat: true},

  // hide the following
  {type: 'number', id: 'plasmids', hide: true},
  {type: 'text', id: 'common_name', hide: true},
  {type: 'text', id: 'isolation_comments', hide: true},
  {type: 'text', id: 'temperature_range', hide: true},
  {type: 'text', id: 'oxygen_requirement', hide: true},
  {type: 'text', id: 'owner', hide: true},
  {type: 'text', id: 'strain', hide: true},
  {type: 'text', id: 'patric_cds', hide: true},
  {type: 'text', id: 'gc_content', hide: true},
  {type: 'text', id: 'refseq_cds', hide: true},
  {type: 'text', id: 'gram_stain', hide: true},
  {type: 'text', id: 'ncbi_project_id', hide: true},
  {type: 'text', id: 'disease', hide: true},
  {type: 'text', id: 'sequencing_depth', hide: true},
  {type: 'text', id: 'organism_name', hide: true},
  {type: 'text', id: 'isolation_source', hide: true},
  {type: 'text', id: 'genome_name', hide: true},
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


const columns = columnSpec.filter(obj => !obj.hide)


export function Genomes() {
  const [data, setData] = useState(null)
  const [total, setTotal] = useState(null)
  const [showActions, setShowActions] = useState(false)

  const {taxonID} = useParams()

  useEffect(() => {

  }, [])

  const onTableCtrlChange = (state) => {
    const params = {...state, eq: {taxon_lineage_ids: taxonID}}
    return listGenomes(params)
      .then((res) => {
        updateData(res)
      }).catch((e) => {
        // Todo: implement error message
      })
  }

  const updateData = (res) => {
    res = res.data.response
    let data = res.docs
    console.log('data', data, columns)

    setTotal(res.numFound)
    setData(data)
  }

  const onColumnChange = (i, showCol) => {
    if (showCol) {
      setHidden(hidden.filter(idx => idx !== i))
      return
    }

    setHidden([...hidden, i])
  }

  return (
    <Root>

      {/* todo: migrate to using "pagination" option of grid */}
      <TableControls
        columns={columns}
        onChange={onTableCtrlChange}
        onColumnChange={onColumnChange}
        total={total}
      />

      {!data &&
        <Progress className="card-progress"/>
      }

      {data &&
        <Grid
          checkboxes
          columns={columns}
          rows={data}
        />
      }

      {/*<Actions open={showActions}/> */}
    </Root>
  )
}


const Root = styled.div`
  margin: 10px;
  flex-grow: 1;
`



