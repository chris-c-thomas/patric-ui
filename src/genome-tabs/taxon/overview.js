import React, {useEffect, useState} from 'react'
import { Link, useParams} from "react-router-dom"
import styled from 'styled-components'

import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import Pie from '../../charts/pie'
import Table from '../../tables/Table'

import {getTaxon, listRepresentative, getTaxonChartData, getAMRCounts} from '../../api/data-api'
import {getPublications } from '../../api/ncbi-eutils'


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
    <>
      <div className="flex align-items-center space-between">
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
            shrink: true
          }}
          margin="dense"
          variant="outlined"
        />
      </div>

      <div style={{height: 350}}>
        {type == 'host' && <Pie data={host_name.slice(0,topN)} /> }
        {type == 'disease' && <Pie data={disease.slice(0,topN)} /> }
        {type == 'country' && <Pie data={isolation_country.slice(0,topN)} /> }
        {type == 'status' && <Pie data={genome_status.slice(0,topN)} /> }
      </div>
    </>
  )
}

const TopNField = styled(TextField)`
  width: 100px;
  & .MuiInputBase-input {
    height: 15px;
  }
`

const AMRChart = (props) => {
  const {data} = props

}

const Publications = ({data}) =>
  <PubList>
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
  </PubList>

const PubList = styled.ul`

  padding-left: 20px;

  li {
    margin-bottom: 10px;
  }
`

const TaxonMetaTable = ({data}) =>
  <MetaTable>
    <tbody>
      <tr><Label>Taxon ID</Label><td>{data.taxon_id}</td></tr>
      <tr><Label>Rank</Label><td>{data.taxon_rank}</td></tr>
      <tr>
        <Label>Lineage</Label>
        <td>
          {data.lineage_ids
            .map((id, i) =>
              <span key={id}>
                <Link to={`/taxonomy/${id}/overview`}>
                  {data.lineage_names[i]}
                </Link>
                {i < data.lineage_ids.length - 1 && ', '}
              </span>
            )
          }
        </td>
      </tr>

      <tr><Label>Genetic Code</Label><td>{data.genetic_code}</td></tr>
    </tbody>
  </MetaTable>


const MetaTable = styled.table`
  font-size: 1em;
`

const Label = styled.td`
  white-space: nowrap;
  vertical-align: top;
  font-weight: 500;
`


export default function Overview() {
  const {taxonID} = useParams()

  const [rows, setRows] = useState(null)
  const [chartMeta, setChartMeta] = useState(null)
  const [amr, setAMR] = useState(null)
  const [taxonMeta, setTaxonMeta] = useState(null)
  const [taxonName, setTaxonName] = useState(null)
  const [pubs, setPubs] = useState(null)
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

    getTaxonChartData({taxonID})
      .then(meta => {
        setChartMeta(meta)
      })

    getPublications(taxonID)
      .then(pubs => setPubs(pubs))
  }, [taxonID])

  useEffect(() => {
    getTaxon(taxonID).then(data => {
      setTaxonMeta(data)
      setTaxonName(data.lineage_names[data.lineage_names.length - 1] )
    })
  }, [])

  return (
    <Root>
      <Meta>
        <Title>{taxonName}</Title>
        {taxonMeta &&
          <TaxonMetaTable data={taxonMeta} />
        }

        <SectionTitle>
          <span>Reference/Representative Genomes</span>
        </SectionTitle><br/>
        {!rows && !error && <LinearProgress className="card-progress" /> }
        {rows &&
          <Table
            offsetHeight="250px"
            columns={columns}
            rows={rows}
            emptyNotice="No reference genomes found"
          />
        }
      </Meta>

      <Charts>
        <SectionTitle>
          <span>Genomes by Metadata</span>
        </SectionTitle><br/>
        {chartMeta && <MetaCharts data={chartMeta}/>}
      </Charts>

      <Pubs>
        <SectionTitle>
          <span>Publications</span>
        </SectionTitle><br/>
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

const Title = styled.h2`
  padding-bottom: 10px;
  margin: 10px 0;
  border-bottom: 1px solid #aaa;
`

const SectionTitle = styled.div`
  background: #2f74a3;
  border-radius: 0;
  text-align: left;
  box-shadow: none;
  padding-left: 0;
  margin-top: 12px;

  span {
    background: #fff;
    color: #666;
    font-weight: normal;
    font-family: "Didact Gothic", Arial, Helvetica, sans-serif;
    font-size: 16px;
    line-height: 20px;
    padding: 5px 5px 5px 0;
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