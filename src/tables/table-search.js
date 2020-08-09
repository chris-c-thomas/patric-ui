
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Grid from '@material-ui/core/Grid'

// icons
import filterIcon from '../../assets/icons/filter.svg'
import downloadIcon from '../../assets/icons/download.svg'

import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/SearchOutlined'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import useDebounce from '../utils/use-debounce'




export default function TableControls(props) {
  const {onSearch, enableTableOptions, searchPlaceholder} = props

  const [query, setQuery] = useState(null)
  const debounceQuery = useDebounce(query, 300)

  useEffect(() => {
    onSearch({query})
  }, [debounceQuery])

  return (
    <Grid container>
      {
        enableTableOptions &&
        <Grid item>
          <FilterBtnContainer>
            <Tooltip title="filter">
              <Button aria-label="filter">
                <Icon src={filterIcon} />
              </Button>
            </Tooltip>
          </FilterBtnContainer>
        </Grid>
      }
      <Grid item xs={5}>
        <TextField
          placeholder={searchPlaceholder || 'Search keywords'}
          onChange={e => { setQuery(e.target.value) }}
          fullWidth
          InputProps={{
            style: {marginTop: 4, height: 36},
            startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
          }}
          variant="outlined"
        />
      </Grid>

      {
        enableTableOptions &&
        <Grid item xs={4}>
          <Tooltip title="download">
            <Button aria-label="download" >
              <Icon src={downloadIcon} />
            </Button>
          </Tooltip>
        </Grid>
      }

    </Grid>
  )
}

const FilterBtnContainer = styled.div`
`

const Icon = styled.img`
  height: 20px;
`