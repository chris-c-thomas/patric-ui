
import React, {useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'

import InputBase from '@material-ui/core/InputBase'
import { fade } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import CaretIcon from '@material-ui/icons/ExpandMoreRounded'

import useClickOutside from '../hooks/useClickOutside'

type Props = {
  onFocus?: (boolean) => void
  fullWidth: boolean
  tall?: boolean
}


export default function FancySearch (props: Props) {
  const {onFocus, fullWidth, tall} = props

  const history = useHistory()
  const searchRef = useRef(null)

  const [query, setQuery] = useState(null)


  useClickOutside(searchRef, () => {
    if (onFocus)
      onFocus(false)
  })

  const onSubmit = (evt) => {
    evt.preventDefault()
    history.push(`/search/?keyword(${query})`)
  }

  return (
    <MainSearch fullWidth={fullWidth} tall={tall} ref={searchRef} onSubmit={onSubmit} >
      <SearchType>
        <option>All Data Types </option>
        <option>Genomes</option>
        <option>Features</option>
        <option>Specialtiy Genes</option>
        <option>Taxa</option>
        <option>Transcriptomic Experiments</option>
        <option>Antibiotic</option>
      </SearchType>

      <SearchContainer>
        <InputBase
          startAdornment={ <SearchIcon />}
          placeholder="Search data…"
          inputProps={{
            'aria-label': 'search',
            onFocus: () => onFocus && onFocus(true)
          }}
          margin="dense"
          onChange={(evt) => setQuery(evt.target.value)}
        />
      </SearchContainer>

      <SearchLogic>
        <option>All Terms </option>
        <option>Any terms</option>
        <option>All exact term</option>
        <option>Any exact term</option>
      </SearchLogic>

    </MainSearch>
  )
}

const opacity = 0.15

const MainSearch = styled.form`
  display: flex;
  margin: 0 4px;

  transition: flex cubic-bezier(.32,.77,.47,.86) 0.25s;
  ${props => props.fullWidth &&
    'flex: 1;'}

  select {
    /* todo(nc): fully style firefox */
    -webkit-appearance: caret;
    -moz-appearance: none;
    background-color: ${fade('#fff', opacity)};
    color: #fff;
    font-size: .85em;
    height: 24px;

    &:hover {
      background-color: ${fade('#fff', opacity + .1)};
    }
  }

  ${props => props.tall ?
    'height: 40px; font-size: 1.3em;' : ''}
`

const SearchContainer = styled.div`
  position: relative;
  background-color: ${fade('#fff', opacity)};
  color: #fff;
  padding: 0 5px;
  width: 100%;

  &:hover {
    background-color: ${fade('#fff', opacity + .1)};
  }

  .MuiInputBase-root {
    width: 100%;
    min-width: 200px;
  }

  .MuiInputBase-input {
    color: #fff;
    padding: 3px 0 0 0;
    font-size: .9em;
  }

  svg {
    color: #fff;
    padding-right: 5px;
  }
`

const borderHex = '#234d69' // #2e75a3
const radius = '4px'

const SearchType = styled.select`
  border-radius: ${radius} 0 0 ${radius};
  border: none;
  border-right: 1px solid ${borderHex};
  padding-left: 4px;
  width: 105px;
`

const SearchLogic = styled.select`
  border-radius: 0 ${radius} ${radius} 0;
  border: none;
  border-left: 1px solid ${borderHex};
  width: 75px;
`