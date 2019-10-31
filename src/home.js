import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import bacteria from '../assets/imgs/bacteria.png';
import archaea from '../assets/imgs/archaea.png';
import eukaryotic from '../assets/imgs/eukaryotic.png';
import phages from '../assets/imgs/phages.png';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';

import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import images from '../assets/imgs/services/*.jpg';
import config from './config.js'

import * as Auth from './api/auth-api';
import SignInDialog from './auth/sign-in-dialog';

const services = [
  {type: 'All'},
  {
    type: 'Genomics', name: 'Assembly',
    descript: 'Assembly using SPAdes, Unicycler, and more',
    path: '/apps/assembly',
    tutorial: `${config.docsURL}/tutorial/genome_assembly/assembly.html`
  }, {
    type: 'Genomics', name: 'Annotation',
    descript: 'Annotate using the RAST tool kit (RASTtk)',
    path: '/apps/annotation',
    tutorial: `${config.docsURL}/user_guides/services/genome_annotation_service.html`
  }, {
    type: 'Genomics', name: 'Comprehensive Genome Analysis',
   descript: 'Complete, streamlined analysis'
  },
  {type: 'Genomics', name: 'BLAST'},
  {type: 'Genomics', name: 'Similar Genome Finder'},
  {type: 'Genomics', name: 'Variation Analysis'},
  {type: 'Genomics', name: 'Tn-Seq Analysis'},
  {type: 'Genomics', name: 'Phylogenetic Tree'},
  {type: 'Genomics', name: 'Genome Alignment'},
  {type: 'Metagenomics', name: 'Metagenomic Read Mapping'},
  {type: 'Metagenomics', name: 'Taxonomic Classification'},
  {type: 'Metagenomics', name: 'Metagenomic Binning'},
  {type: 'Transcriptomics', name: 'Expression Import'},
  {type: 'Transcriptomics', name: 'RNA-Seq Analysis'},
  {type: 'Proteomics', name: 'Protein Family Sorter'},
  {type: 'Proteomics', name: 'Proteome Comparison'},
  {type: 'Metabolomics', name: 'Comparative Pathway'},
  {type: 'Metabolomics', name: 'Model Reconstruction'},
  {type: 'Data Utilities', name: 'Data Mapper'},
  {type: 'Data Utilities', name: 'Fastq Utilities'}
]

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(2, 4),
    padding: theme.spacing(2, 2),
  },
  scroller: {
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    marginTop:  theme.spacing(2),
    '&::-webkit-scrollbar': {
      width: '10px',
      height: '7px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#666',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#eee',
      borderRadius: '10px'
    }
  },
  filterChip: {
    marginRight: theme.spacing(1)
  }
}));

const Subtitle = (props) => {
  const { children } = props;
  return (
    <>
      <Typography variant="h6"
        style={props.inline ? {display: 'inline', marginRight: '10px'} : {}}>
        {children}
      </Typography>
    </>
  );
}

const ChipBtn = (props) => {
  return (
    <Chip variant="outlined"
      style={{marginRight: '10px'}}
      clickable
      component={Link}
      {...props}
      avatar={<Avatar src={props.src} />}
    />
  )
}

const Overview = () => {
  const styles = useStyles();
  return (

    <Paper className={styles.card}>
      <Subtitle>
        Baterial Bioinformatics Resource Center
      </Subtitle>
      <p>
        PATRIC, the PAThosystems Resource Integration Center, provides integrated data and analysis
        tools to support biomedical research on bacterial infectious diseases.
      </p>

      <div>
        <Subtitle inline>
          Browse
        </Subtitle>
        <ChipBtn label="Bacteria" src={bacteria} to="/taxonomy/2/overview"/>
        <ChipBtn label="Archaea" src={archaea} to="/taxonomy/2157/overview" />
        <ChipBtn label="Eukaryotic" src={eukaryotic} to="/taxonomy/2759/overview"/>
        <ChipBtn label="Phages" src={phages} to="/taxonomy/10239/overview" />
      </div>
    </Paper>
  )
}

const ChipFilters = (props) => {
  const styles = useStyles();
  const {onClick, filterState} = props;
  return (
    <span>
      {
        [...new Set(services.map(obj => obj.type))]
          .map(type => {
            const opts = filterState == type ? {} : {variant: 'outlined'}
            return (
              <Chip
                {...opts}
                color={filterState == type ? 'primary' : 'default'}
                key={type}
                clickable
                className={styles.filterChip}
                label={type}
                onClick={() => onClick(type)}
              />
            )
          })
      }
    </span>
  )
}

const cardStyles = makeStyles({
  card: {
    maxWidth: 275,
    display: 'inline-block',
    marginRight: '10px'
  },
  media: {
    marginBottom: 68,
    width: '100%'
  },
  tag: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

const ServiceCard = (props) => {
  const classes = cardStyles();
  const {name, type, descript, path, tutorial} = props;

  // ignore all filter
  if (type == 'All') return (<></>);

  const imgPath = images[name.toLowerCase().replace(/ /g, '_')];

  return (
    <Card className={classes.card} component={Link} to={path || '/'}>
      <CardActionArea>
        <img className={classes.media} src={imgPath} title={name} />

        <GridListTileBar
          title={name}
          subtitle={<span>{descript || 'A much shorter description, blah blah'}</span>}
          /*actionIcon={
            <IconButton aria-label={`info about ${name}`} className={classes.icon}>
              <InfoIcon />
            </IconButton>
          }*/
        />

        {/* add tag for each card, currently only showing when not displaying "all" */
          props.filter == 'All' &&
          <Chip className={classes.tag} label={type} color="primary" size="small"/>
        }
      </CardActionArea>
    </Card>
  )
}

const ServiceCards = () => {
  const styles = useStyles();
  const [filter, setFilter] = useState('All');
  const [openSignIn, setOpenSignIn] = useState(false);

  return (
    <Paper className={styles.card}>
      <Subtitle inline>
        Analyze Data at PATRIC
      </Subtitle>

      <p>
        At PATRIC, you can <a>upload</a> your private data in a
        workspace, <a>analyze</a> it using high-throughput services, and <a>compare</a> it with other public
        databases using visual analytics tools.
        {
          !Auth.isSignedIn() &&
          <> Please <a onClick={() => setOpenSignIn(true)}>sign in</a> to get started.</>
        }
      </p>

      <Subtitle inline>
        Services
      </Subtitle>

      <ChipFilters
        filterState={filter}
        onClick={type => setFilter(type)}
      />

      <div className={styles.scroller}>
        {
          services.map((obj, i) => (
             obj.type == filter || filter == 'All' ?
              <ServiceCard filter={filter} key={i} {...obj} /> : ''
          ))
        }
      </div>

      <SignInDialog open={openSignIn} onClose={() => setOpenSignIn(false)}/>

    </Paper>
  )
}


export default function Home() {
  return (
    <>
      <Grid container>
        <Grid item xs={9}>
          <Overview />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={9}>
          <ServiceCards />
        </Grid>
      </Grid>
    </>
  )
}

