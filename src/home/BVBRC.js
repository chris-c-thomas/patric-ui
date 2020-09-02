import React from 'react'
import styled from 'styled-components'

import patricLogo from '../../assets/imgs/patric-logo-88h.png'
import images from '../../assets/bv-brc/*.png'
// import imagesJpg from '../../assets/bv-brc/*.jpg'
import { Button } from '@material-ui/core'

import { docsURL } from '../config'


const Home = () =>
  <Root>
    <Notice>
      <strong>NEW: </strong>
      Check out the <a href="/sars-cov-2">SARS-CoV-2 Page</a> and its <a href="app/ComprehensiveSARS2Analysis">Genome Assembly and Annotation Service</a>
    </Notice>


    <Row>
      <Column>
        <Overview>
          <h1>BACTERIAL AND VIRAL BIOINFORMATICS RESOURCE CENTER</h1>
          <p>The Bacterial and Viral Bioinformatics Resource Center (BV-BRC) is an information system designed to support research on bacterial and viral infectious diseases via integration of vital pathogen information with rich data and analysis tools. BV-BRC combines two long-running centers: PATRIC, the bacterial system, and IRD/ViPR, the viral systems.</p>
        </Overview>

        <Row>
          <Patric>
            <div className="patric-info-content">
              <PatricLogo>
                <img src={patricLogo} alt="PATRIC Logo"/>
              </PatricLogo>

              <p>The Pathosystems Resource Integration Center (PATRIC) provides an extensive collection of integrated bacterial data, tools, and visualizations for genomic analysis to aid researchers in discovery and characterization of mechanisms of pathogenicity, supporting development of diagnostics, therapeutics, and vaccines.</p>
              <div className="patric-info-links">
                <ul>
                  <li><a href="https://www.youtube.com/watch?v=K3eL4i9vQBo&feature=emb_title">Quickstart Video</a></li>
                  <li><a href={`${docsURL}/user_guides/`}>User Guides</a></li>
                  <li><a href={`${docsURL}/tutorial/`}>Tutorials</a></li>
                  <li><a href={`${docsURL}/common_tasks/`}>Common Tasks</a></li>
                  <li><a href={`${docsURL}/cli_tutorial/`}>CLI Tutorial</a></li>
                  <li><a href={`${docsURL}/videos/`}>Instructional Videos</a></li>
                  <li><a href={`${docsURL}/contact.html`}>Contact Us / Provide Feedback</a></li>
                </ul>
              </div>
              {/*
                <a href="https://patricbrc.org" target="_blank">
                  <img src={images['patric-homepage.jpg']} alt="PATRIC Homepage" />
                </a>
              */}
            </div>
            <Button variant="contained" color="primary" href="https://patricbrc.org/" disableRipple>
              Visit PATRIC
            </Button>
          </Patric>

          <ViPR>
            <row>
              <title>IRD AND ViPR</title>
              <img className="pull-left" src={images['ird-vipr-logo']} alt="IRD and ViPR Logo" width="100" />
            </row>


            <p>The Influenza Research Database (IRD) and Virus Pathogen Resource (ViPR) provide a wide range of data, analysis and visualization tools, and personal workbenches for the virus research communities that facilitate understanding of viral pathogens and how they interact with their host, leading to new diagnostics, treatments and preventions. </p>

            <ul>
              <li><a href="https://www.fludb.org/brcDocs/IRDHelp/IRDhelpfile.htm">IRD Help Manual</a></li>
              <li><a href="https://www.fludb.org/brc/influenzaTutorials.spg?decorator=influenza">IRD Tutorials &amp; Training</a></li>
              <li><a href="https://www.fludb.org/brc/problemReport.spg?decorator=influenza&category=science">Contact IRD</a></li>
            </ul>
            <ul>
              <li><a href="https://www.viprbrc.org/brcDocs/ViPRHelp/ViPRhelpfile.htm">ViPR Help Manual</a></li>
              <li><a href="https://www.viprbrc.org/brc/viprTutorials.spg?decorator=vipr">ViPR Tutorials &amp; Training</a></li>
              <li><a href="https://www.viprbrc.org/brc/problemReport.spg?decorator=vipr&category=science">Contact ViPR</a></li>
            </ul>

            {/*
              <a href="https://www.fludb.org/brc/home.spg?decorator=influenza" target="_blank" className="hp-link">
                <img src={imagesJpg['ird-homepage']} alt="IRD Homepage" width="200"/>
              </a>
              <a href="https://www.viprbrc.org/brc/home.spg?decorator=vipr" target="_blank">
                <img src={imagesJpg['vipr-homepage']} alt="ViPR Homepage" width="200" />
              </a>
              */
            }


            <Button variant="contained" color="primary" href="https://www.fludb.org/brc/home.spg?decorator=influenza" disableRipple>
              Visit IRD
            </Button>

            <Button variant="contained" color="primary" href="https://www.viprbrc.org/brc/home.spg?decorator=vipr" disableRipple>
              Visit ViPR
            </Button>
          </ViPR>
        </Row>
      </Column>

      <Column>

        <News>
          <h2>NEWS &amp; ANNOUNCEMENTS</h2>
          <ul id="slides"></ul>
          <div id="dot-navigation"></div>
        </News>

        <Feed>
          <a className="twitter-timeline" data-lang="en" data-height="310" data-dnt="true" data-theme="light" href="https://twitter.com/BVBRC_DB?ref_src=twsrc%5Etfw">Tweets by BVBRC_DB</a>
          <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        </Feed>

      </Column>
    </Row>
  </Root>


const Root = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1040px;
  margin: 60px auto 0 auto;

  ul {
    list-style: none;
    padding: 0;
  }

  h1 { font-size: 1.5em; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.15em; }
`

const Card = styled.div`
  background: #fff;
  padding: 20px;
  margin: 10px;
`

const Row = styled.div`
  display: flex;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Notice = styled(Card)`
`

const Overview = styled(Card)`
`

const News = styled(Card)`
`


const Patric = styled(Card)`
  width: 45%;
`

const PatricLogo = styled.div`
  background: #0b4771;
  padding: 10px;
  img {
    width: 125px;
  }
`

const ViPR = styled(Card)`
  width: 45%;
`


const Feed = styled(Card)`
`

export default Home
