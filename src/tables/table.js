import React, {useState, memo, useEffect, useRef} from 'react'
import styled from 'styled-components'

import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'

import IconButton from '@material-ui/core/IconButton'
import ArrowDown from '@material-ui/icons/ArrowDropDown'
import ArrowRight from '@material-ui/icons/ArrowRight'
import ArrowUp from '@material-ui/icons/ArrowDropUp'

import ColumnMenu from './column-menu'
import Checkbox from '../forms/checkbox'
import TableSearch from './table-search'

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
    columns,
    id,
    expandable,
    onExpand,
    emptyCell,
    checkboxes,
    onCheck,
    checked,
    onDoubleClick
  } = props

  const {rowID} = row
  const [caret, setCaret] = useState(false)

  const onCaret = (id) => {
    setCaret(cur => !cur)
    onExpand(id)
  }

  return (
    <>
      <TableRow hover tabIndex={-1} key={id} onClick={() => onCheck(rowID)} onDoubleClick={onDoubleClick}>
        {emptyCell && <Cell></Cell>}

        {expandable && <ExpandCell caret={caret} onCaret={onCaret} />}

        {checkboxes &&
          <Cell key={id + '-checkbox'} style={{padding: 0}}>
            <Checkbox checked={checked[rowID]} onChange={() => onCheck(rowID)} />
          </Cell>
        }

        <RowCells {...props}/>
      </TableRow>
    </>
  )
}, (prev, next) => false
  // prev.row.rowID == next.row.rowID &&
  // prev.checked[prev.row.rowID] == next.checked[next.row.rowID]
)


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


export default function TableComponent(props) {
  const didMountRef = useRef();

  const {
    onSearch, pagination, offsetHeight, onClick, onDoubleClick,
    onSort, expandable, expandedRowsKey, checkboxes, limit = 200,
    enableTableOptions, onColumnMenuChange,
    MiddleComponent
  } = props

  if (expandable && !expandedRowsKey) {
    throw `Grid component must have prop 'expandedRowsKey' when 'expandable is provided`
  }

  if (pagination && (props.page === undefined || !props.limit)) {
    throw `Grid component must provide 'page' and 'limit' when 'pagination' is used.
      page value was: ${props.page}; limit value was: ${props.limit}.`
  }


  const [rows, setRows] = useState(props.rows)
  const [columns, setColumns] = useState(getVisibleColumns(props.columns))
  const [page, setPage] = useState(Number(props.page))
  const [sortBy, setSortBy] = useState((props.sort && parseSort(props.sort)) || {})

  // keep state on shown/hidden columns
  // initial columns are defined in `columns` spec.
  const [activeColumns, setActiveColumns] = useState(null)

  const [rowsPerPage, setRowsPerPage] = useState(200)

  // checkbox states
  const [allSelected, setAllSelected] = useState(false)
  const [checkedRows, setCheckedRows] = useState({})


  useEffect(() => {
    // todo: refactor/cleanup?
    setRows(props.rows.map((row, i) => ({...row, rowID: page * limit + i})))
  }, [props.rows])

  useEffect(() => {
    setPage(Number(props.page))
  }, [props.page])

  useEffect(() => {
    if (!props.sort) return;
    setSortBy(parseSort(props.sort))
  }, [props.sort])

  useEffect(() => {
    setColumns(getVisibleColumns(props.columns, activeColumns))
  }, [activeColumns])


  const onChangePage = (event, newPage) => {
    setPage(newPage)
    props.onPage(newPage)
  }

  const handleSelectAll = () => {
    rows.forEach(row => {
      setCheckedRows(prev => ({...prev, [row.rowID]: !allSelected}) )
    })

    setAllSelected(prev => !prev)
  }

  const onCheck = (rowID) => {
    if (onClick) onClick(rowID)

    setCheckedRows(prev => ({
      ...prev,
      [rowID]: !(rowID in checkedRows && checkedRows[rowID])
    }))
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
        <Table stickyHeader aria-label="table" size="small">

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
              onCheck={onCheck}
              checked={checkedRows}
              onDoubleClick={onDoubleClick}
              expandable={expandable}
              expandedRowsKey={expandedRowsKey}
            />
          </TableBody>
        </Table>

        {rows.length == 0 &&
          <NoneFoundNotice offset={offsetHeight}>
            No results found.
          </NoneFoundNotice>
        }
      </Container>
    </Root>
  )
}



const Root = styled.div`

`

const CtrlContainer = styled.div`
  margin: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: stretch;
`

const MiddleComponentContainer = styled.div`

`

const Pagination = styled(TablePagination)`
  width: 500px;

  & .MuiTablePagination-actions {
    user-select: none;
    margin: 0;
  }
`

const Container = styled(TableContainer)`
  max-height: ${props => `calc(100% - ${props.offset || '250px'})`};
  width: 100%;

  & td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0;
    font-size: 13px;
  }

  & tr:nth-child(odd) {
    background: #fafafa;
  }

  & td.MuiTableCell-sizeSmall {
    padding: 6px 12px 6px 2px;
  }
  & th.MuiTableCell-sizeSmall {
    padding: 6px 15px 6px 2px;
  }
`

const NoneFoundNotice = styled.div`
  height: ${props => `calc(100% - ${props.offset || '500px'})`};
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 2.0em;
`
