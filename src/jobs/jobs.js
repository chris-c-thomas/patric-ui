import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
  PagingState,
  IntegratedPaging,
  DataTypeProvider,
  TableColumnResizing,
  SortingState,
  Toolbar,
  ToolbarPagingPanel
} from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, VirtualTable, PagingPanel} from '@devexpress/dx-react-grid-material-ui';
import { listJobs } from '../api/app-service-api';

import {toDateTimeStr} from '../utils/units';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background
  },
  card: {
    margin: '5px',
    padding: '20px'
  }
}));



const columns = [
  { name: 'status', title: 'Status' },
  { name: 'submit_time', title: 'Submitted' },
  { name: 'app', title: 'Service' },
  { name: 'outputName', title: 'Output Name' },
  { name: 'start_time', title: 'Started' },
  { name: 'completed_time', title: 'Completed' }
]


const DateFormatter = ({ value }) => toDateTimeStr(value)

const TimeProvider = props => (
  <DataTypeProvider
    formatterComponent={DateFormatter}
    {...props}
  />
);

const Root = props => <Grid.Root {...props} style={{ height: '100%' }} />;

export default function Jobs() {
  const styles = useStyles();

  const [rows, setRows] = useState(null);
  const [timeColumns] = useState(['submit_time', 'start_time', 'completed_time']);


  useEffect(() => {
    listJobs().then(data => {
      console.log('data', data)
      setRows(data)
    })
  }, [])

  return (
    <div className={styles.root}>
      <Paper className={styles.card}>
        blah blah
      </Paper>

      <Paper className={styles.card}>
        {rows &&
        <Grid
          rows={rows}
          columns={columns}
          rootComponent={Root}
        >

          <SortingState
            defaultSorting={[{ columnName: 'completed_time', direction: 'asc' }]}
          />
          <TimeProvider
            for={timeColumns}
          />

          <PagingState
            defaultCurrentPage={0}
            pageSize={200}
          />
          <IntegratedPaging />
          <VirtualTable height="auto" />
          <TableHeaderRow />
          <PagingPanel />
        </Grid>
        }
      </Paper>
    </div>
  )
}

