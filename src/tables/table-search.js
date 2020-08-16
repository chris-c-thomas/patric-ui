
import React, { useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

import Grid from '@material-ui/core/Grid'

// icons
import downloadIcon from '../../assets/icons/download.svg'

import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/SearchOutlined'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import useDebounce from '../utils/use-debounce'

// expand out to sophisticated parsing
const parseRegexSearch = (search) => {
  if (search[0] == '*')
    search = search.slice(1)
  if (search[search.length - 1] == '*')
    search = search.slice(0, -1)
  return search
}


export default function TableControls(props) {
  const didMountdRef = useRef()

  const {search, onSearch, enableTableOptions, searchPlaceholder} = props

  const [query, setQuery] = useState(search ? parseRegexSearch(search) : '')
  const debounceQuery = useDebounce(query, 300)


  useEffect(() => {
    if (!didMountdRef.current) {
      didMountdRef.current = true
      return
    }

    onSearch({query})
  }, [debounceQuery])

  return (
    <Grid container>
      <Grid item xs={5}>
        <Search
          placeholder={searchPlaceholder || 'Search keywords'}
          value={query}
          onChange={e => { setQuery(e.target.value) }}
          fullWidth
          InputProps={{
            style: {marginTop: 7, height: 30},
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

const Search = styled(TextField)`
  .MuiOutlinedInput-adornedStart {
    padding-left: 8px;
  }
`

const Icon = styled.img`
  height: 20px;
`