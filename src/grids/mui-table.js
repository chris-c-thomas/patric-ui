import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import TableSortLabel from '@material-ui/core/TableSortLabel';

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
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 'calc(100% - 60px)',
    overflow: 'auto',
  },

});

export default function StickyHeaderTable(props) {
  const classes = useStyles();
  const [page, setPage] = useState(props.page);
  const [rowsPerPage, setRowsPerPage] = useState(200);

  const {rows, columns} = props;

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
        count={props.total || rows.count || 0}
        onChangePage={handleChangePage}
        // onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map(column => (
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
            {rows.map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}