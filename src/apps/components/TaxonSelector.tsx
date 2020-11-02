import React, { useEffect, useState } from 'react'

import TaxonName from './TaxonName'
import TaxonId from './TaxonId'
import Selector from './Selector'

import { Column, Row } from '../common/FormLayout'


const generaFour = [
  'Acholeplasma',
  'Entomoplasma',
  'Hepatoplasma',
  'Hodgkinia',
  'Mesoplasma',
  'Mycoplasma',
  'Spiroplasma',
  'Ureaplasma'
]

const isCodeFour = (lineage_names) => {
  let codeFour = false
  lineage_names.forEach(lName => {
    if (generaFour.indexOf(lName) >= 0) {
      codeFour = true
    }
  })

  return codeFour
}



type Props = {
  taxonName: string
  taxonId: string
  geneticCode?: string
  namePlaceholder?: string
  idPlaceholder?: string
  onNameChange: (name: string) => void
  onIdChange: (id: string) => void
  onGeneticCodeChange?: (code: string) => void
}


const TaxonSelector = (props: Props) => {
  const {
    taxonName, taxonId, geneticCode, namePlaceholder, idPlaceholder,
    onNameChange, onIdChange, onGeneticCodeChange
  } = props


  // local state to keep things in sync
  const [state, setState] = useState({taxonName, taxonId, geneticCode})

  useEffect(() => {
    setState(prev => ({...prev, taxonName, taxonId, geneticCode}))
  }, [taxonName, taxonId, geneticCode])



  const handleTaxonNameChange = (obj) => {
    const taxonName = obj && 'taxon_name' in obj ? obj.taxon_name : null
    const taxonId = obj && 'taxon_id' in obj ? obj.taxon_id : null

    onNameChange(taxonName)
    onIdChange(taxonId)

    if (geneticCode) {
      const code = isCodeFour(obj.lineage_names) ? '4' : '11'
      onGeneticCodeChange(code)
    }
  }

  const handleTaxonIdChange = (obj) => {
    const taxonName = obj && 'taxon_name' in obj ? obj.taxon_name : null
    const taxonId = obj && 'taxon_id' in obj ? obj.taxon_id : null

    onNameChange(taxonName)
    onIdChange(taxonId)

    if (geneticCode) {
      const code = isCodeFour(obj.lineage_names) ? '4' : '11'
      onGeneticCodeChange(code)
    }
  }

  const handleGeneticCodeChange = (val) => {
    onGeneticCodeChange(val)
  }

  return (
    <Column padRows>
      <Row>
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
      </Row>

      {geneticCode &&
        <Row>
          <Selector
            label="Genetic Code"
            value={state.geneticCode}
            onChange={handleGeneticCodeChange}
            width="200px"
            options={[
              {value: '11', label: '11 (Archaea & most bacteria)'},
              {value: '4', label: '4 (Mycoplasma, Spiroplasma & Ureaplasma)'},
              {value: '25', label: '25 (Candidate Divsion SR1 & Gracilibacteria)'},
            ]}
          />
        </Row>
      }

    </Column>
  )
}



export default TaxonSelector

