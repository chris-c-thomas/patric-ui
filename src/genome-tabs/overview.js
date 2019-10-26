import React, {useEffect, useState} from 'react';
import { Link, useParams} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import Pie from '../charts/pie';

import VirtualTable from '../grids/mui-virtual-table';

import {listRepresentative, getOverviewMeta} from '../api/data-api';




const columns = [{
  dataKey: 'reference_genome',
  label: 'Type',
  width: 300
}, {
  dataKey: 'genome_id',
  label: 'Genome Name',
  width: 300,
  format: (id, row) => <Link to={`/taxonomy/${id}/overview`}>{id}</Link>
}]

const useStyles = makeStyles(theme => ({
  icon: {
    height: '30px'
  },
  paper: {
    margin: theme.spacing(1)
  },
  card: {
    margin: theme.spacing(1)
  },
  repTable: {
    maxHeight: `calc(100%)`,
  },
  title: {
    fontSize: 14,
  },
  overviewTable: {
    margin: theme.spacing(1),
    width: '100%',
    height: '400px'
  },
  topN: {
    marginLeft: theme.spacing(1),
    marginTop: 0,
    width: 60,
  }
}));


const MetaCharts = (props) => {
  const classes = useStyles();

  const {host_name, disease, isolation_country, genome_status} = props.data;

  const [type, setType] = useState('host');
  const [topN, setTopN] = useState(10);

  const onChange = (_, newType) => {
    setType(newType || type);
  }

  const onEnter = (evt) => {
    setType(evt.target.value || type);
  }

  return (
    <Grid container>
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={onChange}
        aria-label="meta pie chart type"
        size="small"
        className="btn-group"
      >
        <ToggleButton onMouseEnter={onEnter} value="host" aria-label="host" disableRipple>
          Host Name
        </ToggleButton>
        <ToggleButton onMouseEnter={onEnter} value="disease" aria-label="disease" disableRipple>
          Disease
        </ToggleButton>
        <ToggleButton onMouseEnter={onEnter} value="country" aria-label="isolation country" disableRipple>
          Isolation Country
        </ToggleButton>
        <ToggleButton onMouseEnter={onEnter} value="status" aria-label="genome status" disableRipple>
          Genome Status
        </ToggleButton>
      </ToggleButtonGroup>

      <TextField
        label="Top N"
        value={topN}
        onChange={evt => setTopN(evt.target.value)}
        type="number"
        className={classes.topN}
        InputLabelProps={{
          shrink: true,
        }}
        margin="dense"
        variant="outlined"
      />

      <Grid item xs={12} style={{height: '400px'}}>
        {type == 'host' && <Pie data={host_name.slice(0,topN)} /> }
        {type == 'disease' && <Pie data={disease.slice(0,topN)} /> }
        {type == 'country' && <Pie data={isolation_country.slice(0,topN)} /> }
        {type == 'status' && <Pie data={genome_status.slice(0,topN)} /> }
      </Grid>
    </Grid>
  )
}

export default function Overview() {
  const classes = useStyles();

  const [rows, setRows] = useState(null);
  const [meta, setMeta] = useState(null);

  const {taxonID} = useParams();

  useEffect(() => {
    listRepresentative({taxonID})
      .then(rows => {
        console.log('data', rows)
        setRows(rows)
      })

    getOverviewMeta({taxonID})
      .then(meta => {
        console.log('data', meta)
        setMeta(meta)
      })
  }, [])

  return (
    <>
      <Grid container>

        <Grid item xs={4}>
          <Grid container className={classes.repTable}>
            <Grid item xs={12}>
              <Paper className={classes.overviewTable}>
                {rows &&
                <VirtualTable
                  columns={columns}
                  rows={rows}
                />
                }
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={5}>
          <Card className={classes.card}>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Genomes by Metadata
            </Typography>
            {meta && <MetaCharts data={meta}/>}
          </Card>

        </Grid>

        <Grid item xs={3}>
          <Paper className={classes.paper}>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
