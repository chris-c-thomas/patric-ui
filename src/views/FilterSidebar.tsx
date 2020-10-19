import React, {useState, useEffect, useRef, useMemo} from 'react'
import styled from 'styled-components'

import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeftRounded'
import AddIcon from '@material-ui/icons/AddCircleRounded'
import applyIcon from '../../assets/icons/apply-perspective-filter.svg'


import FilterComponent from './Filter'
// import FilterDialog from './FilterDialog'
import MenuSelector from '../tables/ColumnMenu'



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
  collapsed: boolean
  onCollapse: (isCollapsed: boolean) => void
  applyOption?: boolean
}


const FilterSidebar = (props) => {
  const {
    filters,
    onCollapse
  } = props


  const [collapsed, setCollapsed] = useState(props.collapsed)
  const [showApplyBtn, setShowApplyBtn] = useState(false)
  // const [showClearBtn, setShowClearBtn] = useState(false)

  const [newFilters, setNewFilters] = useState([])


  useEffect(() => {
    setCollapsed(props.collapsed)
  }, [props.collapsed])


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

        <IconButton size="small" onClick={handleCollapse}>
          <ArrowLeft />
        </IconButton>
      </Options>

      <Container>
        {newFilters.map(({id, ...filterOpts}) =>
          <FilterComponent
            key={id}
            field={id}
            // onCheck={onCheck}
            {...filterOpts}
            {...props}
          />
        )}

        {filters.filter(obj => !obj.hide)
          .map(({id, ...filterOpts}) =>
            <FilterComponent
              key={id}
              field={id}
              // onCheck={onCheck}
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
  min-width: ${sidebarWidth};
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
