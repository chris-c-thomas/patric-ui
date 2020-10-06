import React, { useState } from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/InfoOutlined'

import Slide from '@material-ui/core/Slide'

import MetaTable, { MetaTableTitle } from './MetaTable'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'


export default function MetaSidebar(props) {
  const {selection, onClose} = props

  const [title, setTitle] = useState()

  const onLoaded = (data) => {
    setTitle(data.genome_name)
  }

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Root>
        <div className="flex space-between">
          <div>
            {(selection || []).length == 1 && title &&
              <MetaTableTitle name={title} />
            }
          </div>

          <IconButton size="small" onClick={() => onClose()} disableRipple>
            <CloseIcon/>
          </IconButton>
        </div>

        {(selection || []).length == 1 &&
          <MetaTable genomeID={selection[0].genome_id} title={false} onLoaded={onLoaded} />
        }

        {(selection || []).length > 1&&
          <Alert icon={<InfoIcon />} severity="info">
            <AlertTitle>{selection.length} items selected</AlertTitle>
          </Alert>
        }

        {!selection &&
          <Alert icon={<InfoIcon />} severity="info">
            <AlertTitle>Nothing Selected</AlertTitle>
            Select one or more items on the left to see their details and possible actions.
          </Alert>
        }
      </Root>
    </Slide>
  )

}


const Root = styled.div`
  background: #fff;
  width: 350px;
  padding: 0 5px;
  border-left: 1px solid #e9e9e9;
  /*box-shadow: -2px 4px 5px 1px #f2f2f2;*/

  font-size: 13px;
  overflow-y: scroll;
`
