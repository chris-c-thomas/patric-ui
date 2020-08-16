import React from "react"
import styled from 'styled-components'
import { useParams} from 'react-router-dom'

import genomeIcon from '../../assets/icons/selection-Genome.svg'
import taxonIcon from '../../assets/icons/selection-Taxonomy.svg'

import TaxonCrumbs from './taxon-crumbs'

const p3Url = 'https://alpha.bv-brc.org'

export const ActionBar = (props) =>
  <Root>
    <Image src={props.title.includes('Genome') ? genomeIcon : taxonIcon} />
      {props.title}
    <TaxonCrumbs />
    <P3Link
      href={props.title.includes('Genome') ?
        `${p3Url}/view/Genome/${useParams().genomeID}#view_tab=${useParams().view}` :
        `${p3Url}/view/Taxonomy/${useParams().taxonID}#view_tab=${useParams().view}`
      }
      target="_blank"
    >
      p3
    </P3Link>
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

const P3Link = styled.a`
  position: absolute;
  top: 60;
  right: 10;
  opacity: .7;
`