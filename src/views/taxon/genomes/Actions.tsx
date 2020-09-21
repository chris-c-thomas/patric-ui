import React, {useState} from 'react'

import {ActionContainer} from '../TabLayout'

import genomeGroupIcon from '../../../../assets/icons/object-group.svg'
import ActionBtn from '../../../tables/ActionBtn'
import GenomeGroupDialog from '../../genome-group-dialog'


export default function Actions() {
  const [showGroupDialog, setShowGroupDialog] = useState(false)

  const onGroup = () => {
    setShowGroupDialog(true)
  }

  return (
    <ActionContainer>
      <ActionBtn aria-label="filter" onClick={onGroup}>
        <img src={genomeGroupIcon} />
        <div>Group</div>
      </ActionBtn>

      <GenomeGroupDialog open={showGroupDialog}/>
    </ActionContainer>
  )
}


