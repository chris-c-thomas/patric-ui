import React, {useState} from 'react'

import {ActionContainer} from '../TabLayout'

import ActionBtn from '../../../tables/ActionBtn'
import Tooltip from '@material-ui/core/Tooltip'

import genomeGroupIcon from '../../../../assets/icons/object-group.svg'
// import copyIcon from '../../../../assets/icons/copy.svg'
import downloadIcon from '../../../../assets/icons/download.svg'

import CreateGroupDialog from '../../CreateGroupDialog'
import Alert from '@material-ui/lab/Alert/Alert'
import Snackbar from '@material-ui/core/Snackbar/Snackbar'



type Props = {
  selection: any[]
}

export default function Actions(props: Props) {
  const {
    selection
  } = props


  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [snack, setSnack] = useState(null)


  const needToImplement = () => {
    alert('need to implement this action')
  }

  const handleCreateGroup = (status) => {
    setShowGroupDialog(false)
    setSnack(status)
  }


  return (
    <ActionContainer>
      <Tooltip title="Create group...">
        <ActionBtn aria-label="group" onClick={() => setShowGroupDialog(true)}>
          <img src={genomeGroupIcon} />
          <div>Group</div>
        </ActionBtn>
      </Tooltip>

      {/* deal with copy option later
      <Tooltip title="Copy options...">
        <ActionBtn aria-label="copy" onClick={needToImplement}>
          <img src={copyIcon} />
          <div>Copy</div>
        </ActionBtn>
      </Tooltip>
      */}

      <Tooltip title="Download options...">
        <ActionBtn aria-label="download" onClick={needToImplement}>
          <img src={downloadIcon} />
          <div>download</div>
        </ActionBtn>
      </Tooltip>


      {showGroupDialog &&
        <CreateGroupDialog
          type="genome_group"
          selection={selection}
          onClose={() => setShowGroupDialog(false)}
          onCreate={handleCreateGroup}
        />
      }

      {snack &&
        <Snackbar open={true} autoHideDuration={5000} onClose={() => setSnack(null)}>
          <Alert onClose={() => setSnack(null)} severity="success">
            {snack}
          </Alert>
        </Snackbar>
      }
    </ActionContainer>
  )
}


