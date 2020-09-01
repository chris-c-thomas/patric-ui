import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/SearchOutlined'
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeftRounded'

import applyIcon from '../../assets/icons/apply-perspective-filter.svg'
import plusIcon from '../../assets/icons/plus-circle.svg'
import { getFacets } from '../api/data-api'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '../forms/checkbox'

const FilterComponent = (props) => {
  const {
    field, label, core, taxonID, hideSearch,
    onCheck, facetQueryStr = null
  } = props

  const [enableQuery, setEnableQuery] = useState(false)

  const [data, setData] = useState(null)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    // if facetQueryString includes field, don't update (a little bit hacky?)
    if (facetQueryStr && facetQueryStr.includes(field)) {
      console.log(`field '${field} found in in filter string; skipping FilterComponent update`)
      return
    }

    getFacets({field, core, taxonID, facetQueryStr: unescape(facetQueryStr)})
      .then(data => setData(data))
  }, [facetQueryStr])

  useEffect(() => {
    onCheck({field, value: checked})
  }, [checked])

  const handleCheck = (id) => {
    setChecked(prev => ({...prev, [id]: !prev[id]}))
  }

  // only render if there's actually facet data
  if (data && !data.length) return <></>

  return (
    <FilterRoot>
      <Header>
        <Title>
          {label}
        </Title>

        {!hideSearch && data && data.length > 0 &&
          <SearchBtn onClick={() => setEnableQuery(!enableQuery)} disableRipple>
            <SearchIcon/>
          </SearchBtn>
        }
      </Header>

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
          data.slice(0, 10).map(obj =>
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
    </FilterRoot>
  )
}

const FilterRoot = styled.div`
  margin-bottom: 10px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.div`
  margin-left: 5px;
`
const Filters = styled.div`
  max-height: 250px;
  overflow: scroll;
`

const CBContainer = styled(FormControlLabel)`
  margin-left: 5px;

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


const getFacetFields = (state) =>
  Object.keys(state)
    .reduce((acc, k) => getFilterCount(state[k]) > 0 ? [...acc, k] : acc, [])


const getFilterCount = (obj) =>
  Object.keys(obj).filter(k => obj[k]).length


const getORStr = (state, field) =>
  ('or(' +
    Object.keys(state[field])
      .reduce((acc, name) =>
        state[field][name] ?
          [...acc, `eq(${field},"${encodeURIComponent(name.replace(/,/g, '%2C'))}")`] : acc
      , [])
      .join(',') +
  ')').replace(/,*or\(\),*/g, '')


// todo: refactor?  lists may actually be better after all.
const buildFilterString = (state) => {
  let queryStr;

  // first get fields that have facet filters
  const fields = getFacetFields(state)

  // eq(field,val)
  if (fields.length == 1 && getFilterCount(state[fields[0]]) == 1) {
    const field = fields[0]
    const [query, _] = Object.entries(state[field])[0]
    queryStr = `eq(${field},"${encodeURIComponent(query.replace(/,/g, '%2C'))}")`

  // or(eq(field,val), ..., eq(field_n,val_n))
  } else if (fields.length == 1) {
    queryStr =
      fields.map(field => getORStr(state, field))
        .join(',')

  // and(or(...), ..., or(...))
  } else {
    queryStr =
      ('and(' +
        fields.map(field => getORStr(state, field))
          .join(',') +
      ')').replace(/,*and\(\),*/g, '')
  }

  return queryStr
}



const Sidebar = (props) => {
  const {
    filters,  // list of objects
    onChange,
    onCollapse
  } = props

  if (!onChange)
    throw '`onChange` is required a prop for the sidebar component'

  let didMountRef = useRef()

  // {fieldA: {facet1: true, facet2: false}, fieldB: {facet3, facet4}}
  const [query, setQuery] = useState({})

  // and(or(eq(...),...))
  const [queryStr, setQueryStr] = useState(props.facetQueryStr)

  const [collapsed, setCollapsed] = useState(props.collapsed)
  const [showApplyBtn, setShowApplyBtn] = useState(null)

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    const fields = getFacetFields(query)

    // only build string and do callback if necessary
    if (fields.length) {
      const qStr = buildFilterString(query)
      setQueryStr(qStr)
      onChange(query, qStr)
    }

    if (queryStr) {
      setShowApplyBtn(true)
    }
  }, [query, props.facetQueryStr])


  useEffect(() => {
    setCollapsed(props.collapsed)
  }, [props.collapsed])

  const onCheck = ({field, value}) => {
    setQuery(prev => ({
      ...prev,
      [field]: value
    }))
  }


  const onAddFilter = () => {

  }

  const onApplyFilters = () => {

  }

  const handleCollapse = () => {
    setCollapsed(!collapsed)
    onCollapse(!collapsed)
  }

  return (
    <SidebarRoot collapsed={collapsed}>
      <Options>
        <AddFilterBtn>
          <Tooltip title="Add a filter below" >
            <Button onClick={onAddFilter} size="small" color="primary" disableRipple>
              <Icon src={plusIcon} /> Add Filter
            </Button>
          </Tooltip>
        </AddFilterBtn>

        {showApplyBtn &&
          <Tooltip title="Apply filters to all views" >
            <Button onClick={onApplyFilters} size="small" color="primary">
              <Icon src={applyIcon} /> Apply
            </Button>
          </Tooltip>
        }
        <CollapseBtn onClick={handleCollapse}>
          <ArrowLeft />
        </CollapseBtn>
      </Options>

      <Container>
        {
          filters.map(({id, label, hideSearch}) =>
            <FilterComponent
              key={id}
              field={id}
              label={label}
              hideSearch={hideSearch}
              onCheck={onCheck}
              facetQueryStr={queryStr}
              {...props}
            />
          )
        }
      </Container>
    </SidebarRoot>
  )
}

const sidebarWidth = '249px'
const optionsHeight = '30px'

const SidebarRoot = styled.div`
  overflow: scroll;
  background: #fff;
  width: ${sidebarWidth};
  border-right: 1px solid #e9e9e9;

  @media (max-width: 960px) {
    display: none;
  }

  ${props => props.collapsed ? 'display: none' : ''}
`

const Container = styled.div`
  margin-top: calc(20px + ${optionsHeight});
`

const Options = styled.div`
  position: fixed;
  height: ${optionsHeight};
  width: ${sidebarWidth};
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  background-image: linear-gradient(to right, rgba(240,240,240,1), rgba(255,255,255,1));
  z-index: 100;
`

const CollapseBtn = styled.a`
  margin-top: 5px;
  color: #444;
`

const AddFilterBtn = styled.div`
  margin-left: 5px;
`

const Icon = styled.img`
  height: 18px;
  margin-right: 5px;
`
export default Sidebar