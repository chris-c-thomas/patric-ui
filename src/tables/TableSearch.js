
import React, { useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/SearchOutlined'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import useDebounce from '../hooks/useDebounce'

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

  const {search, onSearch, searchPlaceholder} = props

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
    <>
      <Search
        placeholder={searchPlaceholder || 'Search keywords'}
        value={query}
        onChange={e => { setQuery(e.target.value) }}
        InputProps={{
          style: { height: 30, width: '260px'},
          startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
        }}
        variant="outlined"
      />
    </>
  )
}


const Search = styled(TextField)`
  .MuiOutlinedInput-adornedStart {
    padding-left: 8px;
  }
`