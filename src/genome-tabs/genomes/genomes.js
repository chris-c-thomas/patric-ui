
import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

import columns from './columns'

import Actions from './actions';
import TableControls from '../../grids/table-controls'
import SolrGrid from '../../grids/solr-grid'
import { listGenomes } from '../../api/data-api';

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
  const styles = useStyles();

  const [data, setData] = useState(null);
  const [hidden, setHidden] = useState(hideColumns);
  const [total, setTotal] = useState(null);
  const [showActions, setShowActions] = useState(false);

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


  const onTableCtrlChange = (state) => {
    return listGenomes(state)
      .then((res) => {
        updateData(res);
      })
  }

  const onColumnChange = (i, showCol) => {
    if (showCol) {
      setHidden(hidden.filter(idx => idx !== i));
      return;
    }

    setHidden([...hidden, i])
  }

  return (
    <div>
      <div className={styles.root}>
        <TableControls
          columns={columns}
          onChange={onTableCtrlChange}
          onColumnChange={onColumnChange}
          total={total} />

        {!data &&
          <div>
            <CircularProgress className={styles.progress}/>
            Loading...
          </div>
        }

        {data &&
          <SolrGrid
            data={data}
            columns={columns}
            hidden={hidden}
            colHeaders={colHeaders}
            onRowSelect={() => setShowActions(true)}
            />
        }
      </div>
      {/*<Actions open={showActions}/> */}
    </div>

  );
};
