import React, {useEffect, useState} from 'react'
import { Link, useParams} from 'react-router-dom';

import {getTaxon, getGenomeCount} from '../api/data-api'

const TaxonCrumbs = (props) => {

  const [names, setNames] = useState(null)
  const [ids, setIds] = useState(null)
  const [count, setCount] = useState(null)

  const {taxonID, view, genomeID} = useParams()

  useEffect(() => {

    // support both taxon ids and taxon id from genome_id
    const taxID = taxonID || genomeID.split('.')[0]
    getTaxon(taxID).then(data => {
      // ignore 'celluar organisms'
      setNames(data.lineage_names.slice(1))
      setIds(data.lineage_ids.slice(1))
    })

    getGenomeCount(taxID)
      .then(count => setCount(count))
  }, [taxonID])


  return (
    <div>
      {
        names && ids &&
          names.map((name, i) =>
            <span key={name}>
              <Link to={`/taxonomy/${ids[i]}/${view}`} key={name}>{name}</Link>
              {i < names.length - 1 && ' > '}
            </span>
          )
      }
      {
        count &&
        <span className="muted"> ({count} genomes)</span>

      }
    </div>
  )
}


export default TaxonCrumbs
