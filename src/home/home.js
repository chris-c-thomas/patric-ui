import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import clsx from 'clsx'

import Subtitle from '../subtitle';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import TextField from '@material-ui/core/TextField';

import GridListTileBar from '@material-ui/core/GridListTileBar';

import News from './news/news';
import Recents from './recents';
import MyData from './my-data';

import serviceImages from '../../assets/imgs/services/*.jpg';
import chipImages from '../../assets/imgs/biology/*.png';

import config from '../config.js'
import * as Auth from '../api/auth';
import SignInDialog from '../auth/sign-in-dialog';
import JobsOverview from './jobs-overview';
import ChipFilters from '../utils/ui/chip-filters';

const services = [
  {
    type: 'Genomics',
    name: 'Assembly',
    descript: 'Assembly using SPAdes, Unicycler, and more',
    path: '/apps/assembly',
    tutorial: `${config.docsURL}/tutorial/genome_assembly/assembly.html`
  }, {
    type: 'Genomics',
    name: 'Annotation',
    descript: 'Annotate using the RAST tool kit (RASTtk)',
    path: '/apps/annotation',
    tutorial: `${config.docsURL}/user_guides/services/genome_annotation_service.html`
  }, {
    type: 'Genomics',
    name: 'Comprehensive Genome Analysis',
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
  {type: 'Data', name: 'Data Mapper'},
  {type: 'Data', name: 'Fastq Utilities'}
]

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '1440',
    margin: 'auto auto'
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
  }
}));

const NoAuth = props => !Auth.isSignedIn() ? [props.children] : <></>;
const HasAuth = props => Auth.isSignedIn() ? [props.children] : <></>;

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
    <Paper className={clsx('card', styles.overview)}>
      <NoAuth>
        <Subtitle>
          Baterial Bioinformatics Resource Center
        </Subtitle>
        <p>
          PATRIC, the PAThosystems Resource Integration Center, provides integrated data and analysis
          tools to support biomedical research on bacterial infectious diseases.
        </p>
      </NoAuth>

      <div>
        <Subtitle inline>
          Browse
        </Subtitle>
        <ChipBtn label="Bacteria" src={chipImages['bacteria']} to="/taxonomy/2/overview"/>
        <ChipBtn label="Viruses" src={chipImages['bacteria']} to="/taxonomy/10239/overview"/>
        <ChipBtn label="Archaea" src={chipImages['archaea']} to="/taxonomy/2157/overview" />
        <ChipBtn label="Eukaryotic" src={chipImages['eukaryotic']} to="/taxonomy/2759/overview"/>
        <ChipBtn label="Phages" src={chipImages['phages']} to="/taxonomy/10239/overview" />
      </div>

      <div>
        <Subtitle inline>
          Search
        </Subtitle>
        <TextField
          placeholder="search should be here as usual"
          variant="outlined"
          margin="dense"
          style={{width: 'calc(100% - 100px'}}
        />
      </div>
    </Paper>
  )
}


const serviceCardStyles = makeStyles({
  serviceCard: {
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
  const styles = serviceCardStyles();
  const {name, type, descript, path, tutorial} = props;

  // ignore all filter
  if (type == 'All') return (<></>);

  const imgPath = serviceImages[name.toLowerCase().replace(/ /g, '_')];

  return (
    <Card className={styles.serviceCard} component={Link} to={path || '/'}>
      <CardActionArea>
        <img className={styles.media} src={imgPath} title={name} />

        <GridListTileBar
          title={name}
          subtitle={<span>{descript || 'A much shorter description, blah blah'}</span>}
          /*actionIcon={
            <IconButton aria-label={`info about ${name}`} className={styles.icon}>
              <InfoIcon />
            </IconButton>
          }*/
        />

        {/* here's a tab chip if we want it
          <Chip className={styles.tag} label={type} color="primary" size="small"/>
        */}
      </CardActionArea>
    </Card>
  )
}

const ServiceCards = () => {
  const styles = useStyles();
  const [filter, setFilter] = useState('Genomics');
  const [openSignIn, setOpenSignIn] = useState(false);

  return (
    <Paper className="card">
      <NoAuth>
        <Subtitle inline>
          Analyze Data at PATRIC
        </Subtitle>

        <p>
          At PATRIC, you can <a>upload</a> your private data in a
          workspace, <a>analyze</a> it using high-throughput services, and <a>compare</a> it with other public
          databases using visual analytics tools. Please <a onClick={() => setOpenSignIn(true)}>sign in</a> to get started.
        </p>
      </NoAuth>


      <Grid container direction="row" justify="space-between">
        <Grid item>
          <Subtitle inline>Services</Subtitle>
        </Grid>

        <Grid item>
          <ChipFilters
            items={services}
            filterState={filter}
            onClick={type => setFilter(type)}
          />
        </Grid>
      </Grid>

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
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Grid container>

        <Grid container item xs={9} direction="column">
          <Grid item>
            <Overview />
          </Grid>
          <Grid item>
            <ServiceCards />
          </Grid>
          <Grid container>
            <HasAuth>
              <Grid item xs={4}>
                <MyData />
              </Grid>
              <Grid item xs={4}>
                <JobsOverview />
              </Grid>
              <Grid item xs={4}>
                <Recents />
              </Grid>
            </HasAuth>
          </Grid>
        </Grid>

        <Grid container item xs={3} direction="column">
          <Grid item>
            <News />
          </Grid>
          <Grid>

          </Grid>
        </Grid>
      </Grid>
   </div>

  )
}

