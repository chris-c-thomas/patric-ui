import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'

import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
// import Slider from '@material-ui/core/Slider'

import SearchIcon from '@material-ui/icons/SearchOutlined'

import highlightText from '../utils/text'
import Checkbox from '../forms/Checkbox'

import { getFacets } from '../api/data-api'
import { TabContext } from './TabContext'
import {toPrettyDate} from '../utils/dates'
import buildFilterString from './buildFilterString'


// number of rows shown by default for each facet
const MAX_FILTERS = 10


const sortOptions = (options, checked) =>
  [
    ...options.filter(obj => checked.includes(obj.name)),
    ...options.filter(obj => !checked.includes(obj.name))
      .sort((a, b) => b.count - a.count)
  ]


type Props = {
  field: string
  type: string
  label: string
  core: string
  hideSearch?: boolean
  hideSelectAll?: boolean
  // onCheck: ({field: string, value: boolean}) => void
}

export default function Filter(props: Props) {
  const {
    field, type, label, core, hideSearch, hideSelectAll
  } = props

  const {taxonID, genomeID} = useParams()

  // use tab context for view's genomeIDs (or ref genomes)
  const [state, dispatch] = useContext(TabContext)
  const {genomeIDs, filterState} = state

  const checked = field in filterState.byCategory ? filterState.byCategory[field] : []

  // all data for field
  const [allData, setAllData] = useState(null)

  // filtered data
  const [data, setData] = useState([])

  const [showAll, setShowAll] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [showUndo, setShowUndo] = useState(false)

  // query in search field
  const [query, setQuery] = useState('')

  const [range, setRange] = useState({
    min: field in filterState.range ? filterState.range[field].min : '',
    max: field in filterState.range ? filterState.range[field].max : '',
  })

  //const [sliderRange, setSliderRange] = React.useState([0, 100])


  // effect for updating data
  useEffect(() => {
    // don't request if genomeIDs haven't yet
    // been set in the TabContext
    if (core != 'genome' && !genomeIDs) {
      return
    }

    (async() => {
      // if field has a filter checked, we need to get facet counts filtered on all other fields
      let data
      if (checked.length) {
        try {
          // get filter string
          const byCat = {...filterState.byCategory}
          delete byCat[field]
          const range = {...filterState.range}
          delete range[field]
          const filterStr = buildFilterString(byCat, range)

          data = await getFacets({field, core, taxonID, genomeID, genomeIDs, filterStr})
        } catch (err) {
          console.error(err)
        }
      } else {
        data = await getFacets({field, core, taxonID, genomeID, filterStr: filterState.filterString, genomeIDs})
      }

      setAllData(data)
    })()

  }, [taxonID, genomeID, genomeIDs, filterState.filterString])


  // effect for filtering data (currently client-side)
  useEffect(() => {
    if (!allData) return

    const filteredData = allData.filter(obj =>
      obj.name.toLowerCase().includes(query.toLowerCase())
    )

    // sort checked to the top, and sort rest
    setData(sortOptions(filteredData, checked))

    // watch checked for indeterminate state
    const l = checked.length
    if (l > 0 && l < allData.length) {
      setShowUndo(true)
      setSelectAll(false)
    } else if (l == 0) {
      setShowUndo(false)
      setSelectAll(false)
    } else if (l == allData.length ) {
      setSelectAll(true)
    }
  }, [query, allData])


  const handleCheck = (value) => {
    dispatch({type: 'UPDATE', field, value})
  }

  const handleShowAll = () => {
    setShowAll(!showAll)
  }

  const handleSelectAll = () => {
    if (showUndo || selectAll) {
      dispatch({type: 'RESET', field})
    } else {
      dispatch({type: 'SELECT_ALL', field, value: allData.map(obj => obj.name)})
    }
  }

  const onSubmitRange = (evt) => {
    evt.preventDefault()

    dispatch({type: 'RANGE', field, value: range})
  }

  // const handleSliderChange = (evt, newValue) => {
  //  setSliderRange(newValue)
  // }


  // only render if there's actually facet data
  if (allData && !allData.length) return <></>

  return (
    <FilterRoot>
      {allData && allData.length > 0 &&
    <>
      <Header>
        <Title>
          {!hideSelectAll &&
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              size="small"
              indeterminate={showUndo && !selectAll}
            />
          }

          <b style={hideSelectAll ? {marginLeft: 34} : {}}>
            {label}
          </b>
        </Title>

        {!hideSearch &&
          <SearchBtn onClick={() => setShowSearch(!showSearch)} size="small" autoFocus disableRipple>
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
        <RangeForm  onSubmit={onSubmitRange}>
          <div className="flex align-items-center">
            <TextField
              placeholder="Min"
              value={range.min}
              onChange={evt => setRange({min: evt.target.value, max: range.max})}
              InputProps={{
                style: {margin: '5px 10px', height: 26, width: 70}
              }}
              variant="outlined"
            />

            <span>to</span>

            <TextField
              placeholder="Max"
              value={range.max}
              onChange={evt => setRange({max: evt.target.value, min: range.min})}
              InputProps={{
                style: {margin: '5px 5px', height: 26, width: 70}
              }}
              variant="outlined"
            />

            <RangeSubmitBtn
              type="submit"
              size="small"
              color="primary"
              variant="contained"
              disableRipple
            >
              Go
            </RangeSubmitBtn>

          </div>

          {/*
          <Slider
            value={sliderRange}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            aria-labelledby={`${field}-slider`}
            getAriaValueText={() => `${sliderRange[0]} to ${sliderRange[1]}`}
          />
          */}
        </RangeForm>
      }

      <Filters>
        {data.slice(0, showAll ? data.length : MAX_FILTERS)
          .map(({name, count}) =>
            <div key={name}>
              <CBContainer
                control={
                  <Checkbox
                    checked={checked.includes(name)}
                    onChange={() => handleCheck(name)}
                  />}
                label={
                  <>
                    <FacetLabel>
                      {highlightText(type == 'date' ? toPrettyDate(name) : name, query)}
                    </FacetLabel>
                    <Count>
                      {count.toLocaleString()}
                    </Count>
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