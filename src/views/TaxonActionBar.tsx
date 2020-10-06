import React from 'react'
import styled from 'styled-components'
import { useParams} from 'react-router-dom'

import IconButton from '@material-ui/core/IconButton'
import HelpIcon from '@material-ui/icons/HelpOutlineRounded'
import ExternalIcon from '@material-ui/icons/OpenInNew'

import genomeIcon from '../../assets/icons/selection-Genome.svg'
import taxonIcon from '../../assets/icons/selection-Taxonomy.svg'

import TaxonCrumbs from './TaxonCrumbs'

// only for tessting
import config from '../config'
import { Tooltip } from '@material-ui/core'

export const TaxonActionBar = (props) => {
  const {taxonID, genomeID, view} = useParams()

  return (
    <Root>
      <Image src={props.title.includes('Genome') ? genomeIcon : taxonIcon} />
      {props.title}
      <TaxonCrumbs />


      <Tooltip
        title={<>Open guide <ExternalIcon style={{fontSize: 10}} /></>}
      >
        <P3Link
          href={props.title.includes('Genome') ?
            `${config.p3URL}/view/Genome/${genomeID}#view_tab=${view}` :
            `${config.p3URL}/view/Taxonomy/${taxonID}#view_tab=${view}`
          }
          target="_blank"
          className="no-style hover flex-column align-items-center"
        >
          <HelpIcon fontSize="small" />
          <div>Guide</div>
        </P3Link>
      </Tooltip>
    </Root>
  )
}


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
  right: 30;
  opacity: .7;
  > div {
    font-size: 9px;
  }
`
