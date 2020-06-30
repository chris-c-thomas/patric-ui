import React, {useEffect, useState} from 'react'
import { Link, useParams} from 'react-router-dom';

import {getTaxon} from '../api/data-api'

const TaxonCrumbs = (props) => {

  const [names, setNames] = useState(null)
  const [ids, setIds] = useState(null)
  const [count, setCount] = useState(null)

  const {taxonID, view} = useParams()

  useEffect(() => {
    getTaxon(taxonID).then(data => {
      // ignore 'celluar organisms'
      setNames(data.lineage_names.slice(1))
      setIds(data.lineage_ids.slice(1))
      setCount(data.genomes)
    })
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
