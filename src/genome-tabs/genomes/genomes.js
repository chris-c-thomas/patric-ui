
import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

import LinearProgress from '@material-ui/core/LinearProgress'

import Grid from '../../grids/grid'
import { listGenomes } from '../../api/data-api'
import {toPrettyDate} from '../../utils/dates'

import Actions from './actions'

const columnSpec = [
  {
    type: 'text',
    id: 'genome_name',
    label: 'Genome Name',
    format: (_, row) => <Link to={`/genome/${row.genome_id}`}>{row.genome_name}</Link>,
    width: '25%'
  },
  {type: 'number', id: 'genome_id', label: 'Genome ID'},
  {type: 'text', id: 'genome_status', label: 'Genome Status'},
  {type: 'number', id: 'contigs', label: 'Contigs', width: '1%'},
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
const columnIDs = columns.map(obj => obj.id)


export function Genomes() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [state, setState] = useState({page: 0, start: 0, limit: 200})

  const [total, setTotal] = useState(null)
  const [showActions, setShowActions] = useState(false)

  const {taxonID} = useParams()

  useEffect(() => {
    onTableCtrlChange(state)
  }, [taxonID, state])

  const onTableCtrlChange = (state) => {
    setLoading(true)
    console.log('state', state)

    const params = {...state, eq: {taxon_lineage_ids: taxonID}, select: columnIDs}
    return listGenomes(params)
      .then((res) => {
        res = res.data.response
        let data = res.docs
        setTotal(res.numFound)
        setData(data)

        setLoading(false)
      }).catch((e) => {
        setLoading(false)
        // Todo: implement error message
      })
  }


  const onColumnChange = (i, showCol) => {
    if (showCol) {
      setHidden(hidden.filter(idx => idx !== i))
      return
    }

    setHidden([...hidden, i])
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
          <Grid
            pagination
            page={state.page}
            limit={state.limit}
            total={total}
            checkboxes
            columns={columns}
            rows={data}
            onPage={state => setState(state)}
            onSearch={onTableCtrlChange}
            onClick={onClick}
          />
        }
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

