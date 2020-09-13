import React, {useEffect, useState} from 'react'
import { Link, useParams} from 'react-router-dom'

import {getTaxon, getGenomeCount} from '../api/data-api'

const visibleRanks = ['superkingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species']

const getVisibleIndexes = (ranks) => {
  return ranks
    .filter(rank => visibleRanks.indexOf(rank) > -1)
    .map(rank => ranks.indexOf(rank))
}


const TaxonCrumbs = () => {
  const [names, setNames] = useState(null)
  const [ids, setIds] = useState(null)
  const [indexes, setIndexes] = useState(null)

  const [count, setCount] = useState(null)

  const {taxonID, view, genomeID} = useParams()

  useEffect(() => {
    // support both taxon ids and taxon id from genome_id
    const taxID = taxonID || genomeID.split('.')[0]

    getTaxon(taxID).then(data => {
      const {lineage_ids, lineage_names, lineage_ranks} = data

      const idxs = getVisibleIndexes(lineage_ranks)
      setIndexes(idxs)

      let lastVisibleIndex = idxs[idxs.length - 1]
      let lastIndex = lineage_ranks.length - 1

      if (lastVisibleIndex < lastIndex) {
        idxs.push(lineage_ranks.length - 1)
        lastVisibleIndex = idxs[idxs.length - 1]
      }

      // ignore 'celluar organisms'
      setNames(lineage_names)
      setIds(lineage_ids)
    })

    getGenomeCount(taxID)
      .then(count => {
        console.log('count', count)
        setCount(count)
      })
  }, [taxonID, genomeID])


  return (
    <div>
      {indexes && ids && names &&
        indexes.map((idx, i) =>
          <span key={idx}>
            <Link to={`/taxonomy/${ids[idx]}/${view}`}>{names[idx]}</Link>
            {i < indexes.length - 1 && ' > '}
          </span>
        )
      }
      {count != null &&
        <span className="muted"> ({count} {count == 1 ? 'genome' : 'genomes'})</span>
      }
    </div>
  )
}


export default TaxonCrumbs
