import React, {useState} from 'react'

import {ActionContainer} from '../TabLayout'

import ActionBtn from '../../../tables/ActionBtn'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

import genomeGroupIcon from '../../../../assets/icons/object-group.svg'
import copyIcon from '../../../../assets/icons/copy.svg'
import downloadIcon from '../../../../assets/icons/download.svg'

import GenomeGroupDialog from '../../genome-group-dialog'




const Btn = (props) =>
  <Button size="small" variant="outlined" color="primary" disableRipple {...props}>
    {props.children}
  </Button>


export default function Actions() {
  const [showGroupDialog, setShowGroupDialog] = useState(false)

  const onGroup = () => {
    setShowGroupDialog(true)
  }

  const needToImplement = () => {
    alert('need to implement this action')
  }

  return (
    <ActionContainer>

      <Tooltip title="Create a group...">
        <ActionBtn aria-label="group" onClick={onGroup}>
          <img src={genomeGroupIcon} />
          <div>Group</div>
        </ActionBtn>
      </Tooltip>

      <Tooltip title="Copy options...">
        <ActionBtn aria-label="copy" onClick={needToImplement}>
          <img src={copyIcon} />
          <div>Copy</div>
        </ActionBtn>
      </Tooltip>


      <Tooltip title="Download options...">
        <ActionBtn aria-label="download" onClick={needToImplement}>
          <img src={downloadIcon} />
          <div>download</div>
        </ActionBtn>
     </Tooltip>

      <GenomeGroupDialog open={showGroupDialog}/>
    </ActionContainer>
  )
}


