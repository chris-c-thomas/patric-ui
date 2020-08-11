import React from "react"
import styled from 'styled-components'

import genomeIcon from '../../assets/icons/selection-Genome.svg'
import taxonIcon from '../../assets/icons/selection-Taxonomy.svg'

import TaxonCrumbs from './taxon-crumbs'

export const ActionBar = (props) =>
  <Root>
    <Image src={props.title.includes('Genome') ? genomeIcon : taxonIcon} />
      {props.title}
    <TaxonCrumbs />
  </Root>


const Root = styled.div`
  padding: 1.3em 1em;
  min-height: 30px;
`

const Image = styled.img`
  height: 30px;
  float: left;
  margin-right: 1em;
`