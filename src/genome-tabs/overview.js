import React, {useEffect, useState} from 'react';
import { Link, useParams} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import Pie from '../charts/pie';
import BarChart from '../charts/bar';

import VirtualTable from '../grids/mui-virtual-table';

import {listRepresentative, getOverviewMeta, getAMRCounts} from '../api/data-api';
import {getPubSummary, pubSearch } from '../api/ncbi-eutils-api';


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
  overview: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2)
  },
  card: {
    margin: theme.spacing(1)
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
    width: 100,
  },
  publications: {
    '& li': {
      marginBottom: theme.spacing(1)
    }
  }
}));

const getTitle = taxonID => (
  <>
    {taxonID == 2 && 'Bacteria'}
    {taxonID == 2157 && 'Archaea'}
    {taxonID == 2759 && 'Eukaryotic'}
    {taxonID == 10239 && 'Viruses'}
  </>
)


const MetaCharts = (props) => {
  const classes = useStyles();

  const {host_name, disease, isolation_country, genome_status} = props.data;

  const [type, setType] = useState('host');
  const [topN, setTopN] = useState(10);

  return (
    <Grid container>
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(_, val) => setType(val)}
        aria-label="meta pie chart type"
        size="small"
        className="btn-group"
      >
        <ToggleButton value="host" aria-label="host" disableRipple>
          Host Name
        </ToggleButton>
        <ToggleButton value="disease" aria-label="disease" disableRipple>
          Disease
        </ToggleButton>
        <ToggleButton value="country" aria-label="isolation country" disableRipple>
          Isolation Country
        </ToggleButton>
        <ToggleButton value="status" aria-label="genome status" disableRipple>
          Genome Status
        </ToggleButton>
      </ToggleButtonGroup>

      <TextField
        label="Showing Top"
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

      <Grid item xs={12} style={{height: '350'}}>
        {type == 'host' && <Pie data={host_name.slice(0,topN)} /> }
        {type == 'disease' && <Pie data={disease.slice(0,topN)} /> }
        {type == 'country' && <Pie data={isolation_country.slice(0,topN)} /> }
        {type == 'status' && <Pie data={genome_status.slice(0,topN)} /> }
      </Grid>
    </Grid>
  )
}

const AMRChart = (props) => {
  const {data} = props;

}

const Publications = (props) => {
  const {data} = props;
  const classes = useStyles();

  return (
    <ul className={classes.publications}>
      {
        data.map((pub, i) => {
          const authors = pub.authors.map(author => author.name).slice(0, 3);

          return (
            <li key={i}>
              {pub.sortpubdate}<br/>
              <a href="">{pub.title}</a><br/>
              <small>{authors.slice(0,3).join(', ')} {authors.length > 3 && ' et al.'}</small>
            </li>
          )
        })
      }
    </ul>
  )
}

const Card = (props) => {
  return (
    <Paper {...props} className="no-elevation">{props.children}</Paper>
  )
}


export default function Overview() {
  const classes = useStyles();

  const {taxonID} = useParams();

  const [rows, setRows] = useState(null);
  const [meta, setMeta] = useState(null);
  const [amr, setAMR] = useState(null);
  const [pubs, setPubs] = useState(null);


  useEffect(() => {
    listRepresentative({taxonID})
      .then(rows => {
        setRows(rows)

        // Todo: bug:  this is wrong (and is also wrong on production website)
        const genomeIDs = rows.map(r => r.genome_id);
        getAMRCounts({genomeIDs})
          .then(amr => setAMR(amr))
      })

    getOverviewMeta({taxonID})
      .then(meta => setMeta(meta))

    if (taxonID in [2, 2157, 2759, 10239]) {
      getPubSummary()
        .then(pubs => setPubs(pubs))
    } else {
      // Todo add genus/species search, etc
      pubSearch(taxonID)
        .then(pubs => setPubs(pubs))
    }
  }, [])

  return (
    <>
      <Grid container style={{height: 'calc(100% - 200px)'}}>

        <Grid item container direction="column" xs={4} className={classes.overviewTable}>

          <Grid item className={classes.overview}>
            <Card className={classes.overview}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                {getTitle(taxonID)}
              </Typography>
              <hr />
            </Card>

            <Card style={{height: '600px'}}>
              {rows &&
              <VirtualTable
                columns={columns}
                rows={rows}
              />
              }
            </Card>
          </Grid>

        </Grid>

        <Grid item container direction="column" xs={5}>
          <Grid item>
            <Card className={classes.card} style={amr ? {height: '400px'} : {}}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Genomes by Antimicrobial Resistance
              </Typography>
              {/*
                amr &&
                <BarChart
                  data={amr.slice(0, 10)}
                  keys={['Resistant','Susceptible','Intermediate']}
                  indexBy='drug'
                  xLabel="Antibiotic"
                />
              */}
            </Card>
          </Grid>

          <Grid item>
            <Card className={classes.card}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Genomes by Metadata
                </Typography>
                {meta && <MetaCharts data={meta}/>}
              </Card>
          </Grid>
        </Grid>

        <Grid item container direction="column" xs={2}>
          {pubs && <Publications data={pubs} />}
        </Grid>
      </Grid>
    </>
  );
};
