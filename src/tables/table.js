import React, {useState, memo, useEffect, useReducer, useRef} from 'react'
import styled from 'styled-components'

import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'

import IconButton from '@material-ui/core/IconButton'
import ArrowDown from '@material-ui/icons/ArrowDropDown'
import ArrowRight from '@material-ui/icons/ArrowRight'
import ArrowUp from '@material-ui/icons/ArrowDropUp'
import filterIcon from '../../assets/icons/filter.svg'

import ColumnMenu from './ColumnMenu'
import Checkbox from '../forms/checkbox'
import TableSearch from './TableSearch'
import ActionBtn from './ActionBtn'
import downloadIcon from '../../assets/icons/download.svg'

import selectedReducer from './selectedReducer'

import useClickOutside from '../hooks/useClickOutside'

/*
const exampleColumns = [
  {
    id: '123',
    label: 'foo bar',
    width: '10%'
  }, {
    id: '1234',
    label: 'test',
    width: '200px',
    type: 'number'
  }, {
    id: 'population',
    label: 'Population',
    align: 'right', // or use type: 'number'
    format: value => value.toLocaleString(),
  }
]
*/


const Cell = props =>
  <TableCell {...props}>
    {props.children}
  </TableCell>



const ExpandCell = ({caret, onCaret}) =>
  <Cell style={{padding: 0}}>
    <IconButton
      onClick={() => onCaret(id)}
      style={{padding: 0}}
      aria-label="expand"
    >
      {caret ? <ArrowDown /> : <ArrowRight />}
    </IconButton>
  </Cell>


const RowCells = ({columns, row}) =>
  <>
    {
      columns.map(col => {
        const val = row[col.id]

        return (
          <Cell
            key={col.id}
            align={col.type == 'number' ? 'right' : col.align}
            style={{width: col.width}}
          >
            {col.format ? col.format(val, row) : (val ? val : '-')}
          </Cell>
        )
      })
    }
  </>


const Row = memo(props => {
  const {
    row,
    id,
    expandable,
    onExpand,
    emptyCell,
    checkboxes,
    onSelect,
    selected,
    onDoubleClick
  } = props

  const {rowID} = row
  const [caret, setCaret] = useState(false)

  const onCaret = (id) => {
    setCaret(cur => !cur)
    onExpand(id)
  }

  return (
    <TableRow hover
      tabIndex={-1}
      key={id}
      onClick={() => onSelect(rowID, row)}
      onDoubleClick={() => onDoubleClick(row)}
      selected={selected.ids.includes(rowID)}
    >
      {emptyCell && <Cell></Cell>}

      {expandable && <ExpandCell caret={caret} onCaret={onCaret} />}

      {checkboxes &&
        <Cell key={id + '-checkbox'} style={{padding: 0}}>
          <Checkbox checked={selected.ids.includes(rowID)} onChange={() => onSelect(rowID)}/>
        </Cell>
      }

      <RowCells {...props}/>
    </TableRow>
  )
}, () => false
  // prev.row.rowID == next.row.rowID &&
  // prev.checked[prev.row.rowID] == next.checked[next.row.rowID]
)

Row.displayName = 'TableComponent-Row'


const TableRows = (props) => {
  const {
    rows,
    columns,
    expandable,
    expandedRowsKey,
    checkboxes
  } = props

  const [expanded, setExpanded] = useState({})

  const onExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !(id in prev)
    })
    )
  }

  return (
    <>
      {
        rows.map((row, i) => {

          let subRows = []
          if (expandable && i in expanded) {
            subRows = row[expandedRowsKey].map((row, i) => {
              const k = i+rows.length + 1
              return <Row key={k} row={row} columns={expandable} id={k} emptyCell/>
            })
          }

          return [
            <Row key={i} id={i}
              row={row}
              columns={columns}
              expandable={expandable}
              checkboxes={checkboxes}
              onExpand={onExpand}
              {...props}   /* pass on all other props else! */
            />,
            ...subRows
          ]
        })
      }
    </>
  )
}

const getSortArrow = (colID, sort) =>
  <SortArrow>
    {colID in sort && (sort[colID] == 'dsc' ? <ArrowDown /> : <ArrowUp />)}
  </SortArrow>

const SortArrow = styled.span`
  position: absolute;
  & svg {
    width: .9em;
    height: .9em;
  }
`


const TableHeadComponent = (props) => {
  const {
    expandable,
    checkboxes,
    columns,
    handleSelectAll,
    allSelected,
    enableSorting,
    sortBy,
    handleSort
  } = props

  return (
    <TableRow>
      {/* if table is expandable */}
      {expandable && <TableCell style={{padding: 0}} />}

      {/* if table has checkboxes (if table has sslect all checkbox) */}
      {checkboxes &&
        <TableCell style={{padding: 0}}>
          <Checkbox checked={allSelected} onChange={handleSelectAll} />
        </TableCell>
      }

      {/* the main thead parts */}
      {columns.map(col => (
        <TableCell
          key={col.id}
          align={col.type == 'number' ? 'right' : col.align}
          style={{ width: col.width, cursor: enableSorting ? 'pointer' : '' }}
          onClick={() => handleSort(col)}
        >
          {col.label} {getSortArrow(col.id, sortBy)}
        </TableCell>
      ))}
    </TableRow>
  )
}


const parseSort = (str) => ({
  [str.slice(1)]: str.charAt(0) == '-' ? 'dsc' : 'asc'
})

const decodeSort = (sortObj) => {
  if (!sortObj)
    return ''

  const id = Object.keys(sortObj)[0],
    order = sortObj[id]

  return `${order == 'dsc' ? '-' : '+'}${id}`
}

// initial state of columns includes "hide", then shown columns is
// controlled by showColumns (a list of column ids)
const getVisibleColumns = (columns, activeColumns = null) => {
  if (activeColumns) {
    const activeIDs = activeColumns.map(o => o.id)
    return columns.filter(o => activeIDs.includes(o.id))
  }

  return columns.filter(o => !o.hide)
}


const initialSelectionState = {
  lastSelected: null,
  ids: [],
  objs: [],
}

export default function TableComponent(props) {
  const {
    onSearch, pagination, offsetHeight, onSelect, onDoubleClick,
    onSort, expandable, expandedRowsKey, checkboxes,
    enableTableOptions, onColumnMenuChange, emptyNotice,
    MiddleComponent
  } = props

  if (expandable && !expandedRowsKey) {
    throw `Grid component must have prop 'expandedRowsKey' when 'expandable is provided`
  }

  if (pagination && (props.page === undefined || !props.limit)) {
    throw `Grid component must provide 'page' and 'limit' when 'pagination' is used.
      page value was: ${props.page}; limit value was: ${props.limit}.`
  }

  const tableRef = useRef(null)

  const [rows, setRows] = useState(props.rows)
  const [columns, setColumns] = useState(getVisibleColumns(props.columns))
  const [page, setPage] = useState(Number(props.page))
  const [sortBy, setSortBy] = useState((props.sort && parseSort(props.sort)) || {})

  // keep state on shown/hidden columns
  // initial columns are defined in `columns` spec.
  const [activeColumns, setActiveColumns] = useState(null)

  const [rowsPerPage] = useState(200)

  // checkbox states
  const [allSelected, setAllSelected] = useState(false)
  const [selected, dispatch] = useReducer(selectedReducer, initialSelectionState)


  useEffect(() => {
    // todo: refactor/cleanup?
    setRows(props.rows.map((row, i) => ({...row, rowID: i})))
  }, [props.rows])

  useEffect(() => {
    setPage(Number(props.page))
  }, [props.page])

  useEffect(() => {
    if (!props.sort) return
    setSortBy(parseSort(props.sort))
  }, [props.sort])

  useEffect(() => {
    setColumns(getVisibleColumns(props.columns, activeColumns))
  }, [activeColumns, props.columns])

  useEffect(() => {
    // only call onSelect after initialization
    if (!tableRef.current) {
      tableRef.current = true
      return
    }

    if (onSelect) onSelect(selected)
  }, [selected])



  useClickOutside(tableRef, () => {
    console.log('clicked outside', selected)
    dispatch({type: 'CLEAR' })
  })


  const onChangePage = (event, newPage) => {
    setPage(newPage)
    props.onPage(newPage)
  }

  const handleSelectAll = () => {
    alert('re-implement handleSelectAll')
    setAllSelected(prev => !prev)
  }

  const handleSelect = (rowID, obj) => {
    dispatch({type: 'SET', id: rowID, obj, rows })
  }

  const handleSort = (colObj) => {
    const newState = {[colObj.id]: sortBy[colObj.id] == 'asc' ? 'dsc' : 'asc' }
    if (onSort)
      onSort(decodeSort(newState))
  }

  const onColumnChange = (activeCols) => {
    setActiveColumns(activeCols)
    onColumnMenuChange(activeCols)
  }


  return (
    <Root>
      <CtrlContainer>

        { enableTableOptions && props.openFilters &&
          <Tooltip title="Show filters">
            <ActionBtn aria-label="filter" onClick={props.onOpenFilters}>
              <img src={filterIcon} />
              <div>Filters</div>
            </ActionBtn>
          </Tooltip>
        }

        {enableTableOptions &&
          <DownloadContainer>
            <Tooltip title="download">
              <ActionBtn aria-label="download" >
                <img src={downloadIcon} />
                <div>Download</div>
              </ActionBtn>
            </Tooltip>
          </DownloadContainer>
        }

        {onSearch &&
          <TableSearch
            search={props.search}
            onSearch={onSearch}
            enableTableOptions={enableTableOptions}
            searchPlaceholder={props.searchPlaceholder}
          />
        }

        {MiddleComponent &&
          <MiddleComponent />
        }

        {pagination &&
          <Pagination
            labelRowsPerPage={''}
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            rowsPerPage={200}
            page={page}
            backIconButtonProps={{
              disableRipple: true,
              'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
              disableRipple: true,
              'aria-label': 'next page',
            }}
            count={props.total || (rows && rows.length) || 0}
            onChangePage={onChangePage}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        }

        {onColumnMenuChange &&
          <ColumnMenu
            columns={props.columns} // all columns
            onChange={onColumnChange}
          />
        }
      </CtrlContainer>

      <Container offset={offsetHeight}>
        <Table stickyHeader aria-label="table" size="small" ref={tableRef}>

          <TableHead>
            <TableHeadComponent
              columns={columns}
              allSelected={allSelected}
              handleSelectAll={handleSelectAll}
              expandable={expandable}
              checkboxes={checkboxes}
              enableSorting
              sortBy={sortBy}
              handleSort={handleSort}
            />
          </TableHead>

          <TableBody>
            <TableRows
              rows={rows}
              columns={columns}
              checkboxes={checkboxes}
              onSelect={handleSelect}
              selected={selected}
              onDoubleClick={onDoubleClick}
              expandable={expandable}
              expandedRowsKey={expandedRowsKey}
            />
          </TableBody>
        </Table>

        {rows.length == 0 &&
          <NoneFoundNotice offset={offsetHeight}>
            {emptyNotice || 'No results found'}
          </NoneFoundNotice>
        }
      </Container>
    </Root>
  )
}




const Root = styled.div`
`

const CtrlContainer = styled.div`
  border-bottom: 2px solid #f2f2f2;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: left;
`

const DownloadContainer = styled.div`
  margin-right: 10px;
  padding-right: 5px;
  border-right: 2px solid #f2f2f2;
`

const Pagination = styled(TablePagination)`
  justify-self: right;
  flex: 1;

  & .MuiTablePagination-actions {
    user-select: none;
    margin: 0;
  }
`

const Container = styled(TableContainer)`
  /* remove height of control panel */
  max-height: ${props => `calc(100% - ${props.offset || '60px'})`};
  height: 100%;
  width: 100%;

  & td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0;
    font-size: 13px;
  }

  /*
  & tr:nth-child(odd) {
    background: #fafafa;
  }*/

  & td.MuiTableCell-sizeSmall {
    padding: 6px 12px 6px 2px;
  }
  & th.MuiTableCell-sizeSmall {
    padding: 1px 15px 6px 2px;
  }

  & tr.MuiTableRow-root:hover {
    background-color: #f5f5f5;
  }

  & tr.MuiTableRow-root.Mui-selected,
  & tr.MuiTableRow-root.Mui-selected:hover {
    background-color: #ecf4fb;
  }
`

const NoneFoundNotice = styled.div`
  height: ${props => `calc(100% - ${props.offset || '500px'})`};
  display: flex;
  justify-content: center;
  transform: translate(0%, 20%);
  color: #666;
  font-size: 1.5em;
`
