import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Progress from '@material-ui/core/LinearProgress';
import CheckIcon from '@material-ui/icons/CheckCircleRounded'
import WarningIcon from '@material-ui/icons/WarningRounded'
import Chip from '@material-ui/core/Chip'

import Table from '../../src/grids/mui-table'
import { getEnd2EndLog } from '../api/log-fetcher'
import { msToTimeStr } from '../../src/utils/units';
import Subtitle from '../../src/home/subtitle';

const columns = [
  {
    id: 'testFilePath',
    label: 'File',
    format: val => val
  }, {
    id: 'perfStats',
    label: 'Duration',
    format: obj => {
      return msToTimeStr(obj.end - obj.start)
    }
  }, {
    id: 'numPassingTests',
    label: 'Status',
    format: (_, obj) => {
      const {numPassingTests, numFailingTests} = obj
      const total = obj.testResults.length

      if ( numPassingTests == total)
        return <PassChip count={numPassingTests} />
      else if (numFailingTests == total)
        return <FailChip count={numFailingTests} />
      else return (
        <>
          <PassChip count={numPassingTests} />
          <FailChip count={numFailingTests} />
        </>
      )
    }
  }, {
    id: 'logs',
    label: 'Logs',
    format: obj => {
      return ''
    }
  }
]

const PassChip = ({count}) =>
  <Chip className="success"
    label={`All ${count} Passed`}
    size="small"
    icon={<CheckIcon />}
  />


const FailChip = ({count}) =>
  <Chip className="failed"
    label={`All ${count} Failed`}
    size="small"
    icon={<WarningIcon />}
  />


const useStyles = makeStyles(theme => ({
  root: {}
}));


export default function Tests() {
  const styles = useStyles();

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [date, setDate] = useState(null)

  useEffect(() => {
    getEnd2EndLog().then(data => {
      setData(data)
      setDate(data.endTime)
      setLoading(false)
    })
  }, [])

  return (
    <div className={styles.root}>
      <Grid container>

        <Grid container item xs={12} direction="column">
          <Paper className="card">
            {loading && <Progress className="card-progress"/>}

            <Subtitle noUpper>
              Lastest test <small>| {date && new Date(date).toLocaleString()}</small>
            </Subtitle>

            {data &&
              <Table
                columns={columns}
                rows={data.testResults}
              />
            }
          </Paper>
        </Grid>

      </Grid>
   </div>
  )
}

