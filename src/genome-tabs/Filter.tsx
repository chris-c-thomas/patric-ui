import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/SearchOutlined'

import Checkbox from '../forms/Checkbox'
import { getFacets } from '../api/data-api'


// number of rows shown by default for each facet
const MAX_FILTERS = 10


export default function FilterComponent(props) {
  const {
    field, label, core, taxonID, hideSearch,
    onCheck, facetQueryStr = null
  } = props

  const [enableQuery, setEnableQuery] = useState(false)

  const [data, setData] = useState(null)
  const [checked, setChecked] = useState({})
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    // if facetQueryString includes field, don't update (a little bit hacky?)
    if (facetQueryStr && facetQueryStr.includes(field)) {
      console.log(`field '${field} found in in filter string; skipping FilterComponent update`)
      return
    }

    getFacets({field, core, taxonID, facetQueryStr: unescape(facetQueryStr)})
      .then(data => setData(data))
  }, [taxonID, facetQueryStr])

  useEffect(() => {
    onCheck({field, value: checked})
  }, [checked])


  const handleCheck = (id) => {
    setChecked(prev => ({...prev, [id]: !prev[id]}))
  }

  const handleShowAll = () => {
    setShowAll(!showAll)
  }

  // only render if there's actually facet data
  if (data && !data.length) return <></>

  return (
    <FilterRoot>
      {data && data.length > 0 &&
        <Header>
          <Title>
            {label}
          </Title>

          {!hideSearch &&
            <SearchBtn onClick={() => setEnableQuery(!enableQuery)} disableRipple>
              <SearchIcon/>
            </SearchBtn>
          }
        </Header>
      }

      {enableQuery &&
        <TextField
          autoFocus
          placeholder={`Filter ${label}`}
          onChange={() => {}}
          InputProps={{
            style: {margin: '5px 10px', height: 26}
          }}
          variant="outlined"
        />
      }

      <Filters>
        {
          data && data.length > 0 &&
          data.slice(0, showAll ? data.length : MAX_FILTERS).map(obj =>
            <div key={obj.name}>
              <CBContainer
                control={
                  <Checkbox
                    checked={checked[obj.name]}
                    onChange={() => handleCheck(obj.name)}
                  />}
                label={
                  <>
                    <FacetLabel>{obj.name}</FacetLabel>
                    <Count>{obj.count.toLocaleString()}</Count>
                  </>
                }
              />
            </div>
          )
        }
      </Filters>

      {data && data.length > MAX_FILTERS &&
        <MoreBtn onClick={handleShowAll}>
          {!showAll && `${data.length - MAX_FILTERS} more…`}
          {showAll && 'less…'}
        </MoreBtn>
      }
    </FilterRoot>
  )
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

const SearchBtn = styled(Button)`
  margin-right: 10px;
  padding: 0;
  min-width: 0;
`

const MoreBtn = styled.a`
  display: flex;
  margin-left: auto;
  margin-right: 10px;
  font-size: .9em;
`