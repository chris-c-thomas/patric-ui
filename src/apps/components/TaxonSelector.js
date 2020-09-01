import React from 'react'

import TaxonName from './TaxonName'
import TaxonId from './TaxonId'


const TaxonSelector = (props) => {
  const {
    taxonName, taxonId, namePlaceholder, idPlaceholder,
    onNameChange, onIdChange
  } = props

  return (
    <>
      <TaxonName
        value={taxonName}
        placeholder={namePlaceholder || 'e.g. Brucella Cereus'}
        noQueryText="Type to search for a taxonomy name..."
        onChange={onNameChange}
      />

      <TaxonId
        value={taxonId}
        placeholder={idPlaceholder || ''}
        onChange={onIdChange}
        noQueryText="Type to search IDs..."
      />
    </>
  )
}



export default TaxonSelector
