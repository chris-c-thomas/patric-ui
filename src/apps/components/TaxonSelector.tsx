import React from 'react'

import TaxonName from './TaxonName'
import TaxonId from './TaxonId'


type Props = {
  taxonName?: string
  taxonId?: string
  namePlaceholder?: string
  idPlaceHolder?: string
  onNameChange: (name: string) => void
  onIdChange: (id: string) => void
}


const TaxonSelector = (props) => {
  const {
    taxonName, taxonId, namePlaceholder, idPlaceholder,
    onNameChange, onIdChange
  } = props


  const handleTaxonNameChange = (obj) => {
    console.log('propagating ', obj)
    onNameChange(obj && 'taxon_name' in obj ? obj.taxon_name : null)
  }

  const handleTaxonIdChange = (obj) => {
    console.log('propagating ', obj)
    onIdChange(obj && 'taxon_id' in obj ? obj.taxon_id : null)
  }

  return (
    <>
      <TaxonName
        value={taxonName}
        placeholder={namePlaceholder || 'e.g. Brucella Cereus'}
        onChange={handleTaxonNameChange}
        // noQueryText="Type to search for a taxonomy name..."
      />

      <TaxonId
        value={taxonId}
        placeholder={idPlaceholder || ''}
        onChange={handleTaxonIdChange}
        //noQueryText="Type to search IDs..."
      />
    </>
  )
}



export default TaxonSelector

