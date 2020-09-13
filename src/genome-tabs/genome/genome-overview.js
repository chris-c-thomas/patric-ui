import React, {useEffect, useState} from 'react';
import { Link, useParams} from 'react-router-dom';
import styled from 'styled-components'

import Subtitle from '../../subtitle'
import Table from '../../tables/Table';

import {getTaxon} from '../../api/data-api'

import { getGenomeMeta }  from '../../api/data-api';
import { getPubSummary, pubSearch } from '../../api/ncbi-eutils';
import genomeIcon from '../../../assets/icons/genome.svg'


import {columns} from '../taxon/genomes/Genomes'

let metaSpec = {
  'Organism Info':  [
    {id: 'genome_ida'},
    {id: 'genome_name'},
    {id: 'taxon_id', link: 'http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id='},
    {id: 'genome_status', mini: true, editable: true},
    {id: 'strain', editable: true},
    {id: 'serovar', editable: true},
    {id: 'biovar', editable: true},
    {id: 'pathovar', editable: true},
    {id: 'mlst', editable: true},
    {id: 'other_typing', editable: true, 'isList': true},
    {id: 'culture_collection', editable: true},
    {id: 'type_strain', editable: true},
    {id: 'antimicrobial_resistance', editable: true, 'isList': false},
    {id: 'reference_genome'}],
  'Genome Quality':
    [
    {id: 'genome_quality', editable: false},
    {id: 'genome_quality_flags', editable: false},
    {id: 'coarse_consistency', editable: false},
    {id: 'fine_consistency', editable: false},
    {id: 'checkm_completeness', editable: false},
    {id: 'checkm_contamination', editable: false}],
  'Sharing':  [
    {id: 'user_read', editable: false, 'isList': true},
    {id: 'user_write', editable: false, 'isList': true}],
  'Project Info':  [
    {id: 'sequencing_centers'},
    {id: 'completion_date', editable: true, 'type': 'date'},
    {id: 'publication', link: 'http://www.ncbi.nlm.nih.gov/pubmed/', editable: true},
    {id: 'bioproject_accession', link: 'http://www.ncbi.nlm.nih.gov/bioproject/?term=', mini: true, editable: true},
    {id: 'biosample_accession', link: 'http://www.ncbi.nlm.nih.gov/biosample/', mini: true, editable: true},
    {id: 'assembly_accession', link: 'http://www.ncbi.nlm.nih.gov/assembly/', editable: true},
    {id: 'sra_accession', editable: true},
    {id: 'genbank_accessions', link: 'http://www.ncbi.nlm.nih.gov/nuccore/', editable: true},
    {id: 'refseq_accessions', link: 'http://www.ncbi.nlm.nih.gov/nuccore/', editable: true}],
  'Sequence Info':  [
    {id: 'sequencing_status', editable: true},
    {id: 'sequencing_platform', editable: true},
    {id: 'sequencing_depth', editable: true},
    {id: 'assembly_method', editable: true},
    {id: 'chromosomes'},
    {id: 'plasmids'},
    {id: 'contigs'},
    {id: 'genome_length'},
    {id: 'gc_content'},
    {id: 'patric_cds'},
    {'name': 'RefSeq CDS',id: 'refseq_cds'}],
  'Isolate Info':  [
    {id: 'isolation_site', editable: true},
    {id: 'isolation_source', editable: true, 'type': 'textarea'},
    {id: 'isolation_comments', editable: true},
    {id: 'collection_year', editable: true, 'type': 'number'},
    {id: 'collection_date', editable: true, 'type': 'date'},
    {id: 'isolation_country', editable: true},
    {id: 'geographic_location', editable: true},
    {id: 'latitude', editable: true},
    {id: 'longitude', editable: true},
    {id: 'altitude', editable: true},
    {id: 'depth', editable: true},
    {id: 'other_environmental', editable: true, 'isList': true}],
  'Host Info':  [
    {id: 'host_name', editable: true},
    {id: 'host_gender', editable: true},
    {id: 'host_age', editable: true},
    {id: 'host_health', editable: true},
    {id: 'body_sample_site', editable: true},
    {id: 'body_sample_subsite', editable: true},
    {id: 'other_clinical', editable: true, 'isList': true}],
  'Phenotype Info':  [
    {id: 'gram_stain', editable: true},
    {id: 'cell_shape', editable: true},
    {id: 'motility', editable: true},
    {id: 'sporulation', editable: true},
    {id: 'temperature_range', editable: true},
    {id: 'optimal_temperature', editable: true},
    {id: 'salinity', editable: true},
    {id: 'oxygen_requirement', editable: true},
    {id: 'habitat', editable: true},
    {id: 'disease', editable: true, 'isList': true}],
  'Other': [
    {id: 'comments', editable: true, 'type': 'textarea', 'isList': true},
    {id: 'additional_metadata', editable: true, 'type': 'textarea', 'isList': true},
    {id: 'date_inserted', 'type': 'date'},
    {id: 'date_modified', 'type': 'date'}]
}

// merge in labels
for (const key of Object.keys(metaSpec)) {
  metaSpec[key] = metaSpec[key].map(obj => {
    const label = (columns.filter(o => o.id == obj.id)[0] || {}).label
    return {...obj, label}
  })
}

const metaTableBody = (headerName, spec, data) => {
  return (
    <>
      <MetaHeader>
        <td colspan="2">{headerName}</td>
      </MetaHeader>
      {
        spec.map(o => data[o.id] ?
          <tr key={o.id}>
            <td style={{width: '40%'}}><b>{o.label}</b></td>
            <td>{data[o.id]}</td>
          </tr>
          : <></>
        )
      }
    </>
  )
}

const MetaHeader = styled.tr`
  td {
    margin: 10px 0 5px 0;
    background: #f2f2f2;
    padding: 3px 5px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    font-size: 1em;
  }
`


export default function Overview() {

  const {genomeID} = useParams();

  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    getGenomeMeta(genomeID)
      .then(meta => setMeta(meta))
      .catch(e => setError(e))

  }, [])

  useEffect(() => {
    getTaxon(genomeID.split('.')[0]).then(data => {
      setName(data.lineage_names[data.lineage_names.length - 1] )
    })
  }, [])

  return (
    <Root>
      <Meta>
        <Icon src={genomeIcon} /> <MetaTitle>{name}</MetaTitle>
        {
          meta &&
          <MetaTable>
            <tbody>
              {Object.keys(metaSpec).map(headerName =>
                metaTableBody(headerName, metaSpec[headerName], meta)
              )}
            </tbody>
          </MetaTable>
        }
      </Meta>

      <Tables>
      </Tables>

    </Root>
  );
};

const Root = styled.div`
  display: flex;
  height: calc(100% - 160px);
  overflow: scroll;

  & > div {
    margin: 10px;
  }
`

const MetaTitle = styled.span`
  font-size: 1.5em;
  margin-left: 5px;
`

const MetaTable = styled.table`
  font-size: 1em;
`

const Icon = styled.img`
  height: 25px;
  height: 25px;
`

const Meta = styled.div`
  flex: 1.2;
`
const Tables = styled.div`
  flex: 2;
`
const Pubs = styled.div`
  flex: 1;
`
