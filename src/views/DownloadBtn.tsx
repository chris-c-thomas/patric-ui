import React from 'react'
import styled from 'styled-components'

import downloadIcon from '../../assets/icons/download.svg'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import Menu from './Menu'
import MenuItem from '@material-ui/core/MenuItem/MenuItem'


export default function DownloadComponent({onDownload}) {
  return (
    <DownloadContainer>
      <Menu
        button={
          <Tooltip title="View download options..." placement="top">
            <IconButton aria-label="download" size="small">
              <img src={downloadIcon} />
            </IconButton>
          </Tooltip>
        }
      >
        <DownloadTitle>Download Table As...</DownloadTitle>
        <MenuItem onClick={() => onDownload('text/tsv')}>Text</MenuItem>
        <MenuItem onClick={() => onDownload('text/csv')}>CSV</MenuItem>
        <MenuItem onClick={() => onDownload('text/application/vnd.openxmlformats')}>Excel</MenuItem>
      </Menu>
    </DownloadContainer>
  )
}



const DownloadContainer = styled.div`
  margin-left: 10px;
  padding-right: 5px;
  // border-right: 2px solid #f2f2f2;
  img {
    width: 20px;
    filter: contrast(40%);
  }
`

const DownloadTitle = styled.div`
  font-weight: bold;
  width: 100%;
  background: #2e76a3;
  color: #f2f2f2;
  padding: 4px 5px;
`