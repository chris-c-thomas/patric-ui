import React from "react"
import styled from 'styled-components'

import taxonIcon from '../../assets/icons/selection-Taxonomy.svg'
import TaxonCrumbs from './taxon-crumbs'

export const ActionBar = () =>
  <Root>
    <Image src={taxonIcon} />
      Taxon View
    <TaxonCrumbs />
  </Root>


const Root = styled.div`
  padding: 1.3em 1em;
`

const Image = styled.img`
  height: 30px;
  float: left;
  margin-right: 1em;
`