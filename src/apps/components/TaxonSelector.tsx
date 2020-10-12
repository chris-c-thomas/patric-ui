import React, { useEffect, useState } from 'react'

import TaxonName from './TaxonName'
import TaxonId from './TaxonId'


type Props = {
  taxonName?: string
  taxonId?: string
  namePlaceholder?: string
  idPlaceholder?: string
  onNameChange: (name: string) => void
  onIdChange: (id: string) => void
}


const TaxonSelector = (props: Props) => {
  const {
    taxonName, taxonId, namePlaceholder, idPlaceholder,
    onNameChange, onIdChange
  } = props


  // local state to keep name and id components in sync
  const [state, setState] = useState({taxonName, taxonId})


  useEffect(() => {
    setState(prev => ({...prev, taxonName}))
  }, [taxonName])

  useEffect(() => {
    setState(prev => ({...prev, taxonId}))
  }, [taxonId])


  const handleTaxonNameChange = (obj) => {
    const taxonName = obj && 'taxon_name' in obj ? obj.taxon_name : null
    const taxonId = obj && 'taxon_id' in obj ? obj.taxon_id : null

    setState({taxonName, taxonId})
    onNameChange(taxonName)
  }

  const handleTaxonIdChange = (obj) => {
    const taxonName = obj && 'taxon_name' in obj ? obj.taxon_name : null
    const taxonId = obj && 'taxon_id' in obj ? obj.taxon_id : null

    setState({taxonName, taxonId})
    onIdChange(taxonId)
  }

  return (
    <>
      <TaxonName
        value={state.taxonName}
        placeholder={namePlaceholder || 'e.g. Brucella Cereus'}
        onChange={handleTaxonNameChange}
      />

      <TaxonId
        value={state.taxonId}
        placeholder={idPlaceholder || ''}
        onChange={handleTaxonIdChange}
      />
    </>
  )
}



export default TaxonSelector

