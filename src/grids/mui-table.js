import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import IconButton from '@material-ui/core/IconButton'
import ArrowDown from '@material-ui/icons/ArrowDropDown'
import ArrowRight from '@material-ui/icons/ArrowRight'

// import TableSortLabel from '@material-ui/core/TableSortLabel';

/*
const exampleColumns = [
  { id: '123', label: 'foo bar', minWidth: 170 },
  { id: '1234', label: 'test', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: value => value.toLocaleString(),
  }
];
*/

const useStyles = makeStyles({
  tableWrapper: {
    maxHeight: 'calc(100% - 60px)',
  }
});


const Cell = React.memo(props => {
  const {children} = props;
  return (
    <TableCell {...props}>
      {children}
    </TableCell>
  )
})

const Row = props => {
  const {row,
    columns,
    id,
    expandable,
    onExpand,
    emptyCell
  } = props;

  const [caret, setCaret] = useState(false)

  const onCaret = (id) => {
    setCaret(cur => !cur)
    onExpand(id)
  }

  return (
    <>
      <TableRow tabIndex={-1} key={id}>
        {emptyCell && <Cell></Cell>}

        {
          expandable &&
          <Cell style={{padding: 0}}>
            <IconButton
              onClick={() => onCaret(id)}
              style={{padding: 0}}
              aria-label="expand"
            >
              {caret ? <ArrowDown /> : <ArrowRight />}
            </IconButton>
          </Cell>
        }

        {
          columns.map((column, i) => {
            const value = row[column.id];
            return (
              <Cell key={column.id} align={column.align} >
                {column.format ? column.format(value, row) : value}
              </Cell>
            );
          })
        }
      </TableRow>
    </>
  );
}


const TableRows = (props) => {
  const {rows, columns, expandable, expandedRowsKey} = props;

  const [expanded, setExpanded] = useState({})

  const onExpand = (id) => {
    setExpanded(cur => {
      if (id in cur) {
        return {...cur, [id]: false}
      } else
        return ({...cur, [id]: true})
    })
  }

  return (
    <>
      {
        rows.map((row, i) => {
          let subRows = [];
          if (expandable && i in expanded) {
            subRows = row[expandedRowsKey].map((row, i) => {
              const k = i+rows.length + 1
              return <Row key={k} row={row} columns={expandable} id={k} emptyCell/>
            })
          }

          return [
            <Row key={i} row={row} columns={columns} id={i} expandable onExpand={onExpand} />,
            ...subRows
          ]
        })
      }
    </>
  )
}

const usageError = (propName, value) =>
  `StickyHeaderTable component must have prop: ${propName}.  Value was: ${value}`


export default function StickyHeaderTable(props) {
  const classes = useStyles();

  const {pagination, rows, columns} = props;

  if (props.expandable && !props.expandedRowsKey) {
    throw `StickyHeaderTable component must
      have prop 'expandedRowsKey' when 'expandable is provided`
  }


  const [page, setPage] = useState(props.page);
  const [rowsPerPage, setRowsPerPage] = useState(200);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    props.onPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      {
        pagination &&
        <TablePagination
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
          onChangePage={handleChangePage}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      }
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead style={{width: '100%'}}>
            <TableRow>
              {props.expandable && <TableCell style={{padding: 0}} />}
              {columns.map((column, i) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/*.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)*/}
            <TableRows {...props}/>

          </TableBody>
        </Table>
      </div>
    </>
  );
}