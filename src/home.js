import React from 'react';
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

const orange = '#e57200';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background
  },
  card: {
    margin: theme.spacing(2, 4),
    padding: theme.spacing(2, 2),
  },
  hr: {
    borderTop: `1px solid ${orange}`,
    marginRight: 'auto',
    maxWidth: '16%',
    marginLeft: 0
  }
}));


const Subtitle = (props) => {
  const styles = useStyles();
  const { children } = props;
  return (
    <>
      <Typography variant="subtitle2">
        {children}
      </Typography>
      <hr className={styles.hr}/>
    </>
  );
}

const ChipBtn = (props) => {
  return (
    <Chip variant="outlined"
      className="pill"
      clickable
      component={Link}
      {...props}
      avatar={<Avatar src={props.src} />} />
  )
}

const MainCard = () => {
  const styles = useStyles();
  return (
    <Paper className={styles.card}>
      <Subtitle>
        What is PATRIC?
      </Subtitle>
      <p>
        <b>PATRIC</b>, the <b>PAThosystems Resource Integration Center</b>, is the NIH/NIAID-funded
        Bacterial Bioinformatics Resource Center, a web-based resource providing
        integrated omics data and analysis tools to support biomedical
        research on bacterial infectious diseases and antimicrobial resistance.
      </p>

      <p>
        At PATRIC, users can <i>upload</i> their private data into a
        workspace, <i>analyze</i> it using high-throughput
        services, <i>compare</i> it with other public data using visual analytics tools,
        and <i>share</i> results with other users.
      </p>

      <Subtitle>
        Browse Organisms
      </Subtitle>
      <br/>
      <ChipBtn label="Bacteria" src={bacteria} to="/taxonomy/2/overview"/>
      <ChipBtn label="Archaea" src={archaea} to="/taxonomy/2157/overview" />
      <ChipBtn label="Eukaryotic" src={eukaryotic} to="/taxonomy/2759/overview"/>
      <ChipBtn label="Phages" src={phages} to="/taxonomy/10239/overview" />


    </Paper>
  )
}


export default function Home() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Grid container>
        <Grid item xs={8}>
          <MainCard />
        </Grid>

        <Grid item xs={4}>

        </Grid>

      </Grid>

      <Grid container>
        <Grid item xs={4}>
          <Paper className={styles.card}>

            <Subtitle>
              PATRIC Prototype
            </Subtitle>

            <h4>Some Services</h4>
            <ul>
              <li><Link to="/apps/assembly">Assembly</Link></li>
              <li><Link to="/apps/annotation">Annotation</Link></li>
            </ul>
          </Paper>
        </Grid>
      </Grid>


    </div>
  )
}

