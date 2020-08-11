import React, {useEffect, useState} from 'react'
import { Link, useParams} from "react-router-dom"
import styled from 'styled-components'

import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import Pie from '../../charts/pie'
import Table from '../../tables/table'

import {getTaxon, listRepresentative, getTaxonOverview, getAMRCounts} from '../../api/data-api'
import {getPubSummary, pubSearch } from '../../api/ncbi-eutils-api'


const columns = [{
  id: 'reference_genome',
  label: 'Type',
}, {
  id: 'genome_id',
  label: 'Genome Name',
  format: (id, row) => <Link to={`/genome/${id}/overview`}>{row.genome_name}</Link>
}]


const MetaCharts = (props) => {
  const {host_name, disease, isolation_country, genome_status} = props.data

  const [type, setType] = useState('host')
  const [topN, setTopN] = useState(10)

  return (
    <div>
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(_, val) => setType(val)}
        aria-label="meta pie chart type"
        size="small"
        className="btn-group"
      >
        <ToggleButton value="host" aria-label="host" disableRipple>
          Host Name
        </ToggleButton>
        <ToggleButton value="disease" aria-label="disease" disableRipple>
          Disease
        </ToggleButton>
        <ToggleButton value="country" aria-label="isolation country" disableRipple>
          Isolation Country
        </ToggleButton>
        <ToggleButton value="status" aria-label="genome status" disableRipple>
          Genome Status
        </ToggleButton>
      </ToggleButtonGroup>

      <TopNField
        label="Showing Top"
        value={topN}
        onChange={evt => setTopN(evt.target.value)}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        margin="dense"
        variant="outlined"
      />

      <div style={{height: 350}}>
        {type == 'host' && <Pie data={host_name.slice(0,topN)} /> }
        {type == 'disease' && <Pie data={disease.slice(0,topN)} /> }
        {type == 'country' && <Pie data={isolation_country.slice(0,topN)} /> }
        {type == 'status' && <Pie data={genome_status.slice(0,topN)} /> }
      </div>

    </div>
  )
}

const TopNField = styled(TextField)`
  margin-left: 5px;
  margin-top: 0;
`

const AMRChart = (props) => {
  const {data} = props

}

const Publications = (props) => {
  const {data} = props

  return (
    <ul>
      {
        data.map((pub, i) => {
          const authors = pub.authors.map(author => author.name).slice(0, 3)

          return (
            <li key={i}>
              {pub.sortpubdate}<br/>
              <a href="">{pub.title}</a><br/>
              <small>{authors.slice(0,3).join(', ')} {authors.length > 3 && ' et al.'}</small>
            </li>
          )
        })
      }
    </ul>
  )
}


export default function Overview() {
  const {taxonID} = useParams()

  const [rows, setRows] = useState(null)
  const [meta, setMeta] = useState(null)
  const [amr, setAMR] = useState(null)
  const [pubs, setPubs] = useState(null)
  const [taxonName, setTaxonName] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    listRepresentative({taxonID})
      .then(rows => {
        setRows(rows)

        // Todo: bug:  this is wrong (also wrong on prod website)
        /*
        const genomeIDs = rows.map(r => r.genome_id)
        getAMRCounts({genomeIDs})
          .then(amr => setAMR(amr))
        */
      })

    getTaxonOverview({taxonID})
      .then(meta => {
        setMeta(meta)
      })

    if (taxonID in [2, 2157, 2759, 10239]) {
      getPubSummary()
        .then(pubs => setPubs(pubs))
    } else {
      // Todo add genus/species search, etc
      pubSearch(taxonID)
        .then(pubs => setPubs(pubs))
    }
  }, [taxonID])

  useEffect(() => {
    getTaxon(taxonID).then(data => {
      setTaxonName(data.lineage_names[data.lineage_names.length - 1] )
    })
  }, [])

  return (
    <Root>
      <Meta>
        <h2>{taxonName}</h2>
        {!rows && !error && <LinearProgress className="card-progress" /> }
        {rows &&
          <Table
            columns={columns}
            rows={rows}
            offsetHeight="100px"
          />
        }
      </Meta>

      <Charts>
        <h2>Genomes by Metadata</h2>
        {meta && <MetaCharts data={meta}/>}
      </Charts>

      <Pubs>
        <h2>Publications</h2>
        {pubs && <Publications data={pubs} />}
      </Pubs>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  height: calc(100% - 170px);

  & > div {
    margin: 10px;
  }
`

const Meta = styled.div`
  flex: 1.4;
`
const Charts = styled.div`
  flex: 2;
`
const Pubs = styled.div`
  flex: 1;
`



/*
eq(genome_id,223283.9)&limit(1)&in(annotation,(PATRIC,RefSeq))&ne(feature_type,source)&facet((pivot,(annotation,feature_type)),(mincount,0))
eq(genome_id,223283.9)&and(eq(product,hypothetical+protein),eq(feature_type,CDS))&in(annotation,(PATRIC,RefSeq))&limit(1)&facet((field,annotation),(mincount,1))&json(nl,map)
eq(genome_id,223283.9)&and(ne(product,hypothetical+protein),eq(feature_type,CDS))&in(annotation,(PATRIC,RefSeq))&limit(1)&facet((field,annotation),(mincount,1))&json(nl,map)
eq(genome_id,223283.9)&eq(property,EC*)&in(annotation,(PATRIC,RefSeq))&limit(1)&facet((field,annotation),(mincount,1))&json(nl,map)
eq(genome_id,223283.9)&eq(go,*)&in(annotation,(PATRIC,RefSeq))&limit(1)&facet((field,annotation),(mincount,1))&json(nl,map)
eq(genome_id,223283.9)&eq(property,Pathway)&in(annotation,(PATRIC,RefSeq))&limit(1)&facet((field,annotation),(mincount,1))&json(nl,map)
eq(genome_id,223283.9)&eq(property,Subsystem)&in(annotation,(PATRIC,RefSeq))&limit(1)&facet((field,annotation),(mincount,1))&json(nl,map)
eq(genome_id,223283.9)&eq(plfam_id,PLF*)&in(annotation,(PATRIC,RefSeq))&limit(1)&facet((field,annotation),(mincount,1))&json(nl,map)
eq(genome_id,223283.9)&eq(pgfam_id,PGF*)&in(annotation,(PATRIC,RefSeq))&limit(1)&facet((field,annotation),(mincount,1))&json(nl,map)
eq(genome_id,223283.9)&eq(figfam_id,*)&in(annotation,(PATRIC,RefSeq))&limit(1)&facet((field,annotation),(mincount,1))&json(nl,map)
*/