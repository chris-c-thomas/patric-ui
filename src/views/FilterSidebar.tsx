import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeftRounded'
import AddIcon from '@material-ui/icons/AddCircleRounded'
import UndoIcon from '@material-ui/icons/UndoRounded'

import applyIcon from '../../assets/icons/apply-perspective-filter.svg'


import FilterComponent from './Filter'
// import FilterDialog from './FilterDialog'
import MenuSelector from '../tables/MenuSelector'

import buildFilterString from './buildFilterString'


type Filter = {
  id: string
  label: string
  hideSearch?: boolean
  hide?: boolean
  type?: string
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

  let ref = useRef(null)

  // {fieldA: ['cat1', 'cat2'], fieldB: ['cat3', 'cat4']}
  const [filterState, setFilterState] = useState({})

  const [collapsed, setCollapsed] = useState(props.collapsed)
  const [showApplyBtn, setShowApplyBtn] = useState(false)
  // const [showClearBtn, setShowClearBtn] = useState(false)

  const [newFilters, setNewFilters] = useState([])


  useEffect(() => {
    if (!ref.current) {
      ref.current = true
      return
    }

    const qStr = buildFilterString(filterState)
    onChange(filterState, qStr)

    if (qStr && props.applyOption) setShowApplyBtn(true)
    else setShowApplyBtn(false)
  }, [filterState])


  useEffect(() => {
    setCollapsed(props.collapsed)
  }, [props.collapsed])


  const onCheck = ({field, value}) => {
    setFilterState(prev => ({...prev, [field]: value}))
  }

  const onAddFilter = (newFilters) => {
    setNewFilters(newFilters)
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
                  Add Filters
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

        {/*showClearBtn &&
          <Tooltip title="Remove all filters" >
            <Button onClick={onApplyFilters} size="small" color="primary" style={{minWidth: 20}}>
              Clear
            </Button>
          </Tooltip>
        */}

        <CollapseBtn onClick={handleCollapse}>
          <ArrowLeft />
        </CollapseBtn>
      </Options>

      <Container>
        {newFilters.map(({id, ...filterOpts}) =>
          <FilterComponent
            key={id}
            field={id}
            onCheck={onCheck}
            {...filterOpts}
            {...props}
          />
        )}

        {filters.filter(obj => !obj.hide)
          .map(({id, ...filterOpts}) =>
            <FilterComponent
              key={id}
              field={id}
              onCheck={onCheck}
              {...filterOpts}
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
