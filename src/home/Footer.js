import React from 'react'
import styled from 'styled-components'

import Youtube from '@material-ui/icons/YouTube'
import Facebook from '@material-ui/icons/Facebook'
import Twitter from '@material-ui/icons/Twitter'
import Github from '@material-ui/icons/GitHub'

import pngs from '../../assets/bv-brc/*.png'

const Footer = () =>
  <Root>
    <div className="brc-program">
      <a href="https://www.niaid.nih.gov/research/bioinformatics-resource-centers">
        <img src={pngs['brc-logo']} alt="BRC Logo" height="80" />
      </a>

      {/*
        <ul>
          <li><a href="https://www.niaid.nih.gov/research/bioinformatics-resource-centers">NIAID</a></li>
          <li><a href="https://www.patricbrc.org">PATRIC</a></li>
          <li><a href="https://www.viprbrc.org/brc/home.spg?decorator=vipr">ViPR</a></li>
          <li><a href="https://www.fludb.org/brc/home.spg?decorator=influenza">IRD</a></li>
          <li><a href="https://eupathdb.org/eupathdb/">EuPathDB</a></li>
          <li><a href="https://www.vectorbase.org/">VectorBase</a></li>
        </ul>
      */}
    </div>

    <div className="funding">
      <h3>Funding Statement</h3>
      <p>
        This project has been funded in whole or in part with Federal
        funds from the National Institute of Allergy and Infectious Diseases,
        National Institutes of Health, Department of Health and Human Services,
        under Contract No. 75N93019C00076, awarded to the University of Chicago.
      </p>
    </div>

    <div className="follow">
      <h3>Follow Us</h3>
      <a href="https://twitter.com/BVBRC_DB">
        <Twitter className="icon" fontSize="large" />
      </a>
      <a href="https://facebook.com/pages/Pathosystems-Resource-Integration-Center-PATRIC/117100971687823">
        <Facebook className="icon" fontSize="large" />
      </a>
      <a href="https://youtube.com/user/PATRICBRC">
        <Youtube className="icon" fontSize="large"/>
      </a>
      <a href="https://github.com/PATRIC3">
        <Github className="icon" fontSize="large" />
      </a>
    </div>
  </Root>


const Root = styled.div`
  @media (min-width: 960px) and (min-height: 900px) {
    position: fixed;
    bottom: 0;
    left: 0;
  }

  width: 100%;
  z-index: 100;
  display: flex;
  background: linear-gradient(#135b89, #2e75a3);
  color: #f2f2f2;
  font-size: .8em;
  margin-top: 25px;

  h3:after {
    content: "";
    display: block;
    width: 20%;
    padding-top: 10px;
    border-bottom: 1px solid #2e75a3;
  }

  div {
    flex: 1;
    padding: 10px 20px;
  }

  .brc-program {
    flex: .5;
    align-self: center;
    text-align: center;
  }

  .funding {
  }

  .follow {
    flex: .5;
  }

  .icon {
    color: #ddd;
  }
`

export default Footer
