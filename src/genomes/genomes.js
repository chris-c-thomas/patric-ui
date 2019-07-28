
import React, {useState, useEffect} from 'react';
import { HotTable } from '@handsontable/react';
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import TableControls from '../table-controls'

// import Checkbox from '@material-ui/core/Checkbox';

import columns from './columns'

// api
import { listGenomes } from '../api/data-api';

const licenseKey = 'non-commercial-and-evaluation'

const useStyles = makeStyles(theme => ({
  root: {
    margin: '10px',
    flexGrow: 1
  },
  progress: {
    margin: theme.spacing(2),
  }
}));


const colHeaders = columns.map(col => col.label || col.data);
const hideColumns = columns.reduce((acc, col, i) => {
  return col.hide ? [...acc, i] : acc
}, []);



export function Genomes() {
  const [data, setData] = useState(null);
  const [hidden, setHidden] = useState(hideColumns);
  const [total, setTotal] = useState(null);
  const [isLoading, loading] = useState(false);

  const styles = useStyles();
  const rowSelection = {};

  const updateData = (res) => {
    res = res.data.response;
    let data = res.docs;

    setTotal(res.numFound);
    setData(data);
  }

  useEffect(() => {
    listGenomes({})
      .then(res => updateData(res) )
      .catch((e) => {
        // Todo: implement error message
      });
  }, []);


  // Todo: refactor selection checkboxes into component
  let rowHeaders = i => {
    if (i in rowSelection)
      return `<input type="checkbox" data-row=${i} checked />`;
    return `<input type="checkbox" data-row=${i} />`;
  }

  let afterSelection = (row, col, row2, col2) => {
    if (col !== 0 || col2 !== columns.length - 1) return;

    let start = row < row2 ? row : row2,
        end = row2 > row ? row2 : row;

    for (let i = start; i <= end; i++) {
      let cb = document.querySelector(`[data-row="${i}"]`);

      if (i in rowSelection) {
        cb.checked = false;
        rowSelection[i] = false;
        continue;
      }

      cb.checked = true;
      rowSelection[i] = true;
    }

    console.log('row was selected:', row, col, row2, col2)
  }

  const onSearch = (state) => {
    loading(true);
    listGenomes(state)
      .then((res) => {
        updateData(res);
        loading(false);
      })
  }

  const onPrev = (state) => {
    return listGenomes(state)
      .then((res) => {
        updateData(res);
      })
  }

  const onNext = (state) => {
    return listGenomes(state)
      .then((res) => {
        updateData(res);
      })
  }

  const onColumnChange = (i, showCol) => {
    if (showCol) {
      setHidden(hidden.filter(idx => idx !== i));
      return
    }

    setHidden([...hidden, i])
  }

  return (
    <div className={styles.root}>

      <TableControls
        columns={columns}
        onSearch={onSearch}
        onPrev={onPrev}
        onNext={onNext}
        onColumnChange={onColumnChange}
        isLoading={isLoading}
        total={total} />

      {!data &&
        <div>
          <CircularProgress className={styles.progress}/>
          Loading...
        </div>
      }

      {data &&
        <HotTable settings={{
          data: data,
          width: '100%',
          height: '70%',
          wordWrap: false,
          columns,
          colHeaders,
          multiColumnSorting: true,
          manualColumnResize: true,
          manualColumnMove: true,
          rowHeaders: rowHeaders,
          manualRowResize: false,
          //autoColumnSize: true,
          stretchH: 'all',
          filters: true,
          //renderAllRows: true, // has performance issues
          renderAllColumns: true,
          readOnly: true,
          afterSelection,
          licenseKey
          }}

          hiddenColumns={{
            columns: hidden
          }}
          />
      }
    </div>
  );
};
