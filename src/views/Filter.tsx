import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'

import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'

import SearchIcon from '@material-ui/icons/SearchOutlined'

import highlightText from '../utils/text'
import Checkbox from '../forms/Checkbox'

import { getFacets } from '../api/data-api'
import { TabContext } from './TabContext'


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
  type: string
  label: string
  core: string
  hideSearch?: boolean
  onCheck: ({field: string, value: boolean}) => void
  facetQueryStr?: string
}

export default function Filter(props: Props) {
  const {
    field, type, label, core, hideSearch,
    onCheck, facetQueryStr = null
  } = props

  const {taxonID, genomeID} = useParams()

  // use tab context for view's genomeIDs (or ref genomes)
  const [state] = useContext(TabContext)
  const {genomeIDs} = state

  const [allData, setAllData] = useState(null)
  const [checked, setChecked] = useState({})
  const [showAll, setShowAll] = useState(false)

  const [showSearch, setShowSearch] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [showUndo, setShowUndo] = useState(false)
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])

  const [range, setRange] = useState({min: null, max: null})

  useEffect(() => {
    // if facetQueryString includes field, don't update (a little bit hacky?)
    if (facetQueryStr && facetQueryStr.includes(field)) {
      console.log(`field '${field} found in in filter string; skipping FilterComponent update`)
      return
    }

    // don't request if genomeIDs haven't yet
    // been set in the TabContext
    if (core != 'genome' && !genomeIDs)
      return

    getFacets({field, core, taxonID, genomeID, facetQueryStr, genomeIDs})
      .then(data => {
        setAllData(data)
      })
  }, [taxonID, genomeID, facetQueryStr, genomeIDs])


  useEffect(() => {
    onCheck({field, value: checked})

    // sort checked to the top, and sort
    setData(data => {
      const d = sortOptions(data, checked)
      return d
    })

    // watch checked for indeterminate state
    const l = Object.keys(checked).filter(k => checked[k]).length
    if (l > 0 && l < allData.length) {
      setShowUndo(true)
      setSelectAll(false)
    } else if (l == 0) {
      setShowUndo(false)
      setSelectAll(false)
    } else if (l == allData.length ) {
      setSelectAll(true)
    }

  }, [checked])


  useEffect(() => {
    if (!allData) return

    const filteredData = allData.filter(obj =>
      obj.name.toLowerCase().includes(query.toLowerCase())
    )
    setData(filteredData)
  }, [query, allData, setData])


  const handleCheck = (id) => {
    setChecked(prev => ({...prev, [id]: !prev[id]}))
  }

  const handleShowAll = () => {
    setShowAll(!showAll)
  }

  const handleSelectAll = () => {
    if (showUndo || selectAll) {
      setChecked({})
    } else {
      const newState = allData.reduce((acc, obj) => ({...acc, [obj.name]: true}), {})
      setChecked(newState)
    }
  }

  const onSubmitRange = (evt) => {
    evt.preventDefault()
    alert(JSON.stringify(range))
  }


  // only render if there's actually facet data
  if (allData && !allData.length) return <></>

  return (
    <FilterRoot>
      {allData && allData.length > 0 &&
    <>
      <Header>
        <Title>
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
            size="small"
            indeterminate={showUndo && !selectAll}
          />

          <b>{label}</b>
        </Title>

        {!hideSearch &&
          <SearchBtn onClick={() => setShowSearch(!showSearch)} size="small" disableRipple>
            <SearchIcon/>
          </SearchBtn>
        }
      </Header>

      {showSearch &&
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

      {type == 'number' &&
        <RangeForm className="flex align-items-center" onSubmit={onSubmitRange}>
          <TextField
            placeholder="Min"
            onChange={evt => setRange({min: evt.target.value, max: range.max})}
            InputProps={{
              style: {margin: '5px 10px', height: 26, width: 70}
            }}
            variant="outlined"
          />

          <span>to</span>

          <TextField
            placeholder="Max"
            onChange={evt => setRange({max: evt.target.value, min: range.min})}
            InputProps={{
              style: {margin: '5px 5px', height: 26, width: 70}
            }}
            variant="outlined"
          />

          {(range.min || range.max) &&
            <RangeSubmitBtn
              type="submit"
              size="small"
              color="primary"
              variant="contained"
              disableRipple
            >
              Go
            </RangeSubmitBtn>
          }
        </RangeForm>
      }

      <Filters>
        {data.slice(0, showAll ? data.length : MAX_FILTERS)
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

        {data.length == 0 &&
          <NoneFound className="muted">none found</NoneFound>
        }
      </Filters>

      {allData && data.length > MAX_FILTERS &&
        <MoreBtn onClick={handleShowAll}>
          {!showAll && `${data.length - MAX_FILTERS} more…`}
          {showAll && 'less…'}
        </MoreBtn>
      }
    </>
      }
    </FilterRoot>
  )
}


const FilterRoot = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding: 0 5px;

`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
  margin: 5px 0;
  padding-bottom: 5px;
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

const NoneFound = styled.div`
  margin: 0 20px;
`

const RangeForm = styled.form`
  margin-bottom: 5px;
`

const RangeSubmitBtn = styled(Button)`
  &.MuiButton-root {
    margin-left: 5px;
    min-width: 10px;
    height: 26px;
  }
`