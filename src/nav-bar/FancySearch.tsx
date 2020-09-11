
import React, {useRef} from 'react'
import styled from 'styled-components'

import InputBase from '@material-ui/core/InputBase'
import { fade } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'

import useClickOutside from '../hooks/useClickOutside'

type Props = {
  onFocus: (boolean) => void
  fullWidth: boolean
}


export default function FancySearch (props: Props) {
  const {onFocus, fullWidth} = props

  const searchRef = useRef(null)

  useClickOutside(searchRef, () => {
    onFocus(false)
  })

  return (
    <MainSearch fullWidth={fullWidth} ref={searchRef} >
      <SearchType>
        <option>All Data Types </option>
        <option>Genomes</option>
        <option>Features</option>
        <option>Genomes</option>
      </SearchType>

      <SearchContainer>
        <InputBase
          startAdornment={ <SearchIcon />}
          placeholder="Search…"
          inputProps={{
            'aria-label': 'search',
            onFocus: () => onFocus(true)
          }}
          margin="dense"
        />
      </SearchContainer>

      <SearchLogic>
        <option>All Terms </option>
        <option>Genomes</option>
        <option>Features</option>
        <option>Genomes</option>
      </SearchLogic>

    </MainSearch>
  )
}

const MainSearch = styled.div`
  display: flex;
  margin: 0 20px;

  transition: flex cubic-bezier(.32,.77,.47,.86) 0.3s;
  ${props => props.fullWidth &&
    'flex: 1;'}

  select {
    /* todo(nc): fully style firefox */
    -moz-appearance: none;
    background-color: ${fade('#fff', 0.15)};
    color: #fff;
    font-size: .8em;

    &:hover {
      background-color: ${fade('#fff', 0.25)};
    }
  }
`

const SearchContainer = styled.div`
  position: relative;
  background-color: ${fade('#fff', 0.15)};
  color: #fff;
  padding: 0 5px;
  width: 100%;

  &:hover {
    background-color: ${fade('#fff', 0.25)};
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

const SearchType = styled.select`
  border-radius: 3px 0 0 3px;
  border: none;
  border-right: 1px solid #2e75a3;
  padding-left: 3px;
`

const SearchLogic = styled.select`
  border-radius: 0 3px 3px 0;
  border: none;
  border-left: 1px solid #2e75a3;
`