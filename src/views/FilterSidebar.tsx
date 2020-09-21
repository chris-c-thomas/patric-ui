import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeftRounded'
import AddIcon from '@material-ui/icons/AddCircleRounded'

import applyIcon from '../../assets/icons/apply-perspective-filter.svg'


import Filter from './Filter'
// import FilterDialog from './FilterDialog'
import MenuSelector from '../tables/MenuSelector'


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
          [...acc, `eq(${field},%22${encodeURIComponent(name).replace(/,/g, '%2C')}%22)`] : acc
      , [])
      .join(',') +
  ')').replace(/,*or\(\),*/g, '')


// todo: refactor?  lists may actually be better after all.
const buildFilterString = (state) => {
  let queryStr

  // first get fields that have facet filters
  const fields = getFacetFields(state)

  // case for: eq(field,val)
  if (fields.length == 1 && getFilterCount(state[fields[0]]) == 1) {
    const field = fields[0]
    const [query, _] = Object.entries(state[field])[0]
    queryStr = `eq(${field},%22${encodeURIComponent(query).replace(/,/g, '%2C')}%22)`

  // case for: or(eq(field,val), ..., eq(field_n,val_n))
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


type Filter = {
  id: string
  label: string
  hideSearch?: boolean
  hide?: boolean
}

type Props = {
  core: string
  filters: Filter[],
  onChange: (query: object, queryStr: string) => void
  collapsed: boolean
  onCollapse: (isCollapsed: boolean) => void
  facetQueryStr: string
  applyOption?: boolean
}


const FilterSidebar = (props: Props) => {
  const {
    filters,
    onChange,
    onCollapse
  } = props

  if (!onChange)
    throw '`onChange` is required a prop for the sidebar component'

  let didMountRef = useRef(null)

  // {fieldA: {facet1: true, facet2: false}, fieldB: {facet3, facet4}}
  const [query, setQuery] = useState({})

  // query string is something like: and(or(eq(...),...))
  const [queryStr, setQueryStr] = useState(props.facetQueryStr)

  const [collapsed, setCollapsed] = useState(props.collapsed)
  const [showApplyBtn, setShowApplyBtn] = useState(null)

  //const [openDialog, setOpenDialog] = useState(false)
  const [newFilters, setNewFilters] = useState([])

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }

    const qStr = buildFilterString(query)
    setQueryStr(qStr)
    onChange(query, qStr)

    if (qStr && props.applyOption)
      setShowApplyBtn(true)
    else
      setShowApplyBtn(false)
  }, [query])


  useEffect(() => {
    setCollapsed(props.collapsed)
  }, [props.collapsed])


  const onCheck = ({field, value}) => {
    setQuery(prev => ({
      ...prev,
      [field]: value
    }))
  }


  const onAddFilter = (newFilters) => {
    setNewFilters(newFilters)
    console.log('newFilters', newFilters)
  }

  const onApplyFilters = () => {
    alert('The apply feature has not been implemented yet. :(')
  }

  const handleCollapse = () => {
    setCollapsed(!collapsed)
    onCollapse(!collapsed)
  }

  return (
    <SidebarRoot collapsed={collapsed}>
      <Options>
        <MenuSelector
          options={filters.filter(o => o.hide)}
          onChange={onAddFilter}
          headerText="Add a filter"
          noOptionsText="No filters found"
          ButtonComponent={
            <AddFilterBtn>
              <Tooltip title="Add a filter..." >
                <Button startIcon={<AddIcon />} size="small" color="primary" disableRipple>
                  Add Filter
                </Button>
              </Tooltip>
            </AddFilterBtn>
          }
        />

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
        {newFilters.map(({id, label, hideSearch}) =>
          <Filter
            key={id}
            field={id}
            label={label}
            hideSearch={hideSearch}
            onCheck={onCheck}
            facetQueryStr={queryStr}
            {...props}
          />
        )}

        {filters.filter(obj => !obj.hide)
          .map(({id, label, hideSearch}) =>
            <Filter
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


      {/*openDialog &&
        <FilterDialog
          title={}
          onClose={() => setOpenDialog(false)}
          onPrimaryClick={() => setOpenDialog(false)}
          onAddFilters={}
        />
      */}
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

  .MuiButton-startIcon {
    margin-right: 4;
  }

  .MuiSvgIcon-root {
     color: #444;
     padding-right: 0;
  }
`

const Icon = styled.img`
  height: 18px;
  margin-right: 5px;
`
export default FilterSidebar
