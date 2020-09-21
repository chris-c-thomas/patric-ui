import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'

import IconButton from '@material-ui/core/IconButton'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/SearchOutlined'

import highlightText from '../utils/text'
import Checkbox from '../forms/Checkbox'
import { getFacets } from '../api/data-api'


// number of rows shown by default for each facet
const MAX_FILTERS = 10



const sortOptions = (options, checked) =>
  [
    ...options.filter(obj => checked[obj.name]),
    ...options.filter(obj => !checked[obj.name])
      .sort((a, b) => b.count - a.count)
  ]


type Props = {
  field: string
  label: string
  core: string
  taxonID: string
  hideSearch?: boolean
  onCheck: ({field: string, value: boolean}) => void
  facetQueryStr?: string
}

export default function FilterComponent(props: Props) {
  const {
    field, label, core, taxonID, hideSearch,
    onCheck, facetQueryStr = null
  } = props

  const {genomeID} = useParams()

  const [allData, setAllData] = useState(null)
  const [checked, setChecked] = useState({})
  const [showAll, setShowAll] = useState(false)


  const [enableQuery, setEnableQuery] = useState(false)
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    // if facetQueryString includes field, don't update (a little bit hacky?)
    if (facetQueryStr && facetQueryStr.includes(field)) {
      console.log(`field '${field} found in in filter string; skipping FilterComponent update`)
      return
    }

    getFacets({field, core, taxonID, genomeID, facetQueryStr: facetQueryStr})
      .then(data => {
        setAllData(data)
      })
  }, [taxonID, genomeID, facetQueryStr])


  useEffect(() => {
    onCheck({field, value: checked})

    // sort checked to the top, and sort
    setData(data => sortOptions(data, checked))
  }, [checked])


  useEffect(() => {
    if (!allData) return

    const filteredData = allData.filter(obj => obj.name.toLowerCase().includes(query.toLowerCase()))
    setData(filteredData)
  }, [query, allData, setData])


  const handleCheck = (id) => {
    setChecked(prev => ({...prev, [id]: !prev[id]}))
  }

  const handleShowAll = () => {
    setShowAll(!showAll)
  }

  // only render if there's actually facet data
  if (allData && !allData.length) return <></>

  return (
    <FilterRoot>
      {allData && allData.length > 0 &&
        <Header>
          <Title>
            {label}
          </Title>

          {!hideSearch &&
            <SearchBtn onClick={() => setEnableQuery(!enableQuery)} size="small" disableRipple>
              <SearchIcon/>
            </SearchBtn>
          }
        </Header>
      }

      {enableQuery &&
        <TextField
          autoFocus
          placeholder={`Filter ${label}`}
          onChange={evt => setQuery(evt.target.value)}
          InputProps={{
            style: {margin: '5px 10px', height: 26}
          }}
          variant="outlined"
        />
      }

      <Filters>
        {
          allData && allData.length > 0 &&
          data.slice(0, showAll ? data.length : MAX_FILTERS)
            .map(obj =>
              <div key={obj.name}>
                <CBContainer
                  control={
                    <Checkbox
                      checked={checked[obj.name]}
                      onChange={() => handleCheck(obj.name)}
                    />}
                  label={
                    <>
                      <FacetLabel>{highlightText(obj.name, query)}</FacetLabel>
                      <Count>{obj.count.toLocaleString()}</Count>
                    </>
                  }
                />
              </div>
            )
        }
      </Filters>

      {allData && data.length > MAX_FILTERS &&
        <MoreBtn onClick={handleShowAll}>
          {!showAll && `${data.length - MAX_FILTERS} more…`}
          {showAll && 'less…'}
        </MoreBtn>
      }
    </FilterRoot>
  )
}


const getSearchedFilters = (data, search) => {

}

const FilterRoot = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 0 5px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.div`
`
const Filters = styled.div`

`
const CBContainer = styled(FormControlLabel)`
  &.MuiFormControlLabel-root {
    width: 225px;
    margin-left: 0;
  }

  & .MuiTypography-root {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
const FacetLabel = styled.div`
  font-size: .8rem;
`

const Count = styled.div`
  color: #888;
  font-size: .8rem;
`

const SearchBtn = styled(IconButton)`
  &.MuiButtonBase-root {
    margin-right: 5px;
  }
`

const MoreBtn = styled.a`
  display: flex;
  margin-left: auto;
  margin-right: 10px;
  font-size: .9em;
`