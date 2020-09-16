import React from 'react'
import styled from 'styled-components'

import Footer from './Footer'
import patricLogo from '../../assets/imgs/patric-logo-88h.png'
import images from '../../assets/bv-brc/*.png'
import  Button from '@material-ui/core/Button'

import News from './news/news'

import { docsURL } from '../config'
import Alert from '@material-ui/lab/Alert'


const Home = () =>
  <>
    <Root>
      <Alert icon={false} style={{margin: 10, borderBottom: '5px solid #42a242'}}>
        <strong>NEW:</strong>
        Check out the new <a href="/sars-cov-2">SARS-CoV-2 Page</a> and <a href="apps/ComprehensiveSARS2Analysis">Genome Assembly and Annotation Service</a>
      </Alert>

      <Row>
        <ColumnLeft>
          <Overview>
            <h1>BACTERIAL AND VIRAL BIOINFORMATICS RESOURCE CENTER</h1>
            <p>
              The Bacterial and Viral Bioinformatics Resource Center (BV-BRC) is
              an information system designed to support research on bacterial and
              viral infectious diseases via integration of vital pathogen information
              with rich data and analysis tools.
              BV-BRC combines two long-running centers: PATRIC, the bacterial system,
              and IRD/ViPR, the viral systems.
            </p>
          </Overview>

          <Row>
            <Resource>
              <PatricLogo>
                <img src={patricLogo} alt="PATRIC Logo"/>
              </PatricLogo>

              <div>
                <h3>PATRIC</h3>
                <p>
                  The Pathosystems Resource Integration Center (PATRIC) provides an
                  extensive collection of integrated bacterial data, tools, and
                  visualizations for genomic analysis to aid researchers in discovery
                  and characterization of mechanisms of pathogenicity, supporting
                  development of diagnostics, therapeutics, and vaccines.
                </p>
              </div>

              <ul>
                <li><a href="https://www.youtube.com/watch?v=K3eL4i9vQBo&feature=emb_title">Quickstart Video</a></li>
                <li><a href={`${docsURL}/user_guides/`}>User Guides</a></li>
                <li><a href={`${docsURL}/tutorial/`}>Tutorials</a></li>
                <li><a href={`${docsURL}/common_tasks/`}>Common Tasks</a></li>
                <li><a href={`${docsURL}/cli_tutorial/`}>CLI Tutorial</a></li>
                <li><a href={`${docsURL}/videos/`}>Instructional Videos</a></li>
                <li><a href={`${docsURL}/contact.html`}>Contact Us / Provide Feedback</a></li>
              </ul>

              {/*
              <a href="https://patricbrc.org" target="_blank">
                <img src={images['patric-homepage.jpg']} alt="PATRIC Homepage" />
              </a>
              */}

              <div className="btns">
                <Button variant="contained" style={{background: '#42a242', color: '#fff'}} href="https://patricbrc.org/" disableRipple>
                  Visit PATRIC
                </Button>
              </div>
            </Resource>

            <Resource>
              <ViprLogo>
                <img className="pull-left" src={images['ird-vipr-logo']} alt="IRD and ViPR Logo" width="100" />
              </ViprLogo>

              <div>
                <h3>IRD AND ViPR</h3>
                <p>The Influenza Research Database (IRD) and Virus Pathogen Resource (ViPR) provide a wide range of data, analysis and visualization tools, and personal workbenches for the virus research communities that facilitate understanding of viral pathogens and how they interact with their host, leading to new diagnostics, treatments and preventions. </p>
              </div>

              <div className="flex space-between">
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
              </div>

              {/*
              <a href="https://www.fludb.org/brc/home.spg?decorator=influenza" target="_blank" className="hp-link">
                <img src={imagesJpg['ird-homepage']} alt="IRD Homepage" width="200"/>
              </a>
              <a href="https://www.viprbrc.org/brc/home.spg?decorator=vipr" target="_blank">
                <img src={imagesJpg['vipr-homepage']} alt="ViPR Homepage" width="200" />
              </a>
              */
              }

              <div className="btns flex space-between">
                <Button variant="contained" color="secondary" href="https://www.fludb.org/brc/home.spg?decorator=influenza" disableRipple>
                Visit IRD
                </Button>

                <Button variant="contained" color="secondary" href="https://www.viprbrc.org/brc/home.spg?decorator=vipr" disableRipple>
                Visit ViPR
                </Button>
              </div>
            </Resource>
          </Row>
        </ColumnLeft>

        <ColumnRight>
          <NewsContainer>
            <News/>
          </NewsContainer>

          <Feed>
            <a className="twitter-timeline" data-lang="en" data-height="310" data-dnt="true" data-theme="light" href="https://twitter.com/BVBRC_DB?ref_src=twsrc%5Etfw">Tweets by BVBRC_DB</a>
            <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
          </Feed>

        </ColumnRight>
      </Row>
    </Root>

    <Footer />
  </>


const pad = 20

const Root = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1140px;
  margin: 50px auto 0 auto;

  ul {
    list-style: none;
    padding: 0;
  }

  h1 { font-size: 1.5em; margin-top: 0; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.15em; }


  h2:after, h3:after {
    content: "";
    display: block;
    width: 20%;
    padding-top: 10px;
    border-bottom: 1px solid #2e75a3;
  }


  .btns {
    position: absolute;
    bottom: 0;
    margin-bottom: ${pad}px;
  }

  .btns a {
    margin-right: 10px;
  }
`

const Card = styled.div`
  background: #fff;
  padding: ${pad}px;
  margin: 10px;
`

const Row = styled.div`
  display: flex;
`

const ColumnLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2.2;
`

const ColumnRight = styled.div`
  display: flex;
  flex-direction: column;
  flex: .8;
`

const Notice = styled(Card)`
  flex: 3;
`

const Overview = styled(Card)`
  flex: 2;
`

const Resource = styled(Card)`
  flex: 1;
  position: relative;
  min-height: 380px;
`

const PatricLogo = styled.div`
  float: right;
  background: #0b4771;
  padding: 10px;
  margin: 20px 10px 0 0;
  width: 125px;
  img {
    width: 125px;
  }
`

const ViprLogo = styled.div`
  float: right;
  img {
    width: 125px;
    margin-right: 10px;
  }
`

const NewsContainer = styled(Card)`

  padding: 0;
`

const Feed = styled(Card)`
  flex: 1;
`

export default Home
