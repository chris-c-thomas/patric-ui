import React, {useState} from 'react'

import {ActionContainer} from '../TabLayout'

import ActionBtn from '../../../tables/ActionBtn'
import Button from '@material-ui/core/Button'

import genomeGroupIcon from '../../../../assets/icons/object-group.svg'
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

  return (
    <ActionContainer>
      {/*
      <Btn startIcon={<img src={genomeGroupIcon} className="icon"/>} onClick={onGroup}>
        Group
      </Btn>
      */}

      <ActionBtn aria-label="filter" onClick={onGroup}>
        <img src={genomeGroupIcon} />
        <div>Group</div>
      </ActionBtn>

      <GenomeGroupDialog open={showGroupDialog}/>
    </ActionContainer>
  )
}


