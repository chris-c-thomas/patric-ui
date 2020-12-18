import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'


import Radio from '../apps/components/Radio'
import ObjectSelector from '../apps/components/object-selector/ObjectSelector'
import WSFileName from '../apps/components/WSFileName'

import {getUser} from '../api/auth'
import { createGroup } from '../api/ws-api'



const labelMapping = {
  genome_group: 'Genome',
  feature_group: 'Feature',
  experiment_group: 'Experiment'
}

const idMapping = {
  genome_group: 'genome_id',
  feature_group: 'feature_id',
  experiment_group: '?????'
}


type Props = {
  type: 'genome_group' | 'feature_group' | 'experiment_group'
  selection: any[]
  onClose: () => void
  onCreate: (status: string) => void
}

export default function GenomeGroupDialog(props: Props) {
  const {
    type,
    selection,
    onClose,
    onCreate
  } = props

  const label = labelMapping[type]

  const [radioVal, setRadioVal] = useState('newGroup')
  const [inProgress, setInProgress] = useState(false)

  // new group state
  const [groupPath, setGroupPath] = useState(`/${getUser(true)}/Genome Groups`)
  const [groupName, setGroupName] = useState(null)

  // existing group state
  const [existingGroupPath, setExistingGroupPath] = useState(null)


  const handleCreate = async () => {
    if (type == 'experiment_group')
      throw 'experiment group still needs to be implemented.  please figure out primary id.'

    const ids = selection.map(obj => obj[idMapping[type]])

    console.log('creating group:', groupName, groupPath, type, ids)

    if (radioVal == 'newGroup') {
      setInProgress(true)
      await createGroup(groupName, groupPath, type, ids)
    }

    onCreate('Group created')
  }


  const isDisabled = () =>
    inProgress ||
    (radioVal == 'newGroup' && !groupPath || !groupName) ||
    (radioVal == 'existingGroup' && !existingGroupPath)


  return (
    <>
      <Dialog
        open={true}
        onClose={onClose}
        aria-labelledby="create-group-dialog"
      >
        <DialogTitle id="create-group-dialog">
          {radioVal == 'newGroup' ? `Create ${label} Group` : `Add to Existing ${label} Group`}
        </DialogTitle>

        <DialogContent>
          <Radio
            row
            options={[
              {label: 'Create New Group', value: 'newGroup'},
              {label: 'Add to Existing Group', value: 'existingGroup'}
            ]}
            value={radioVal}
            onChange={val => setRadioVal(val)}
          />

          <br/>
          <br/>

          {radioVal == 'newGroup' &&
            <>
              <div className="flex align-items-end">
                <ObjectSelector
                  label="Group Folder"
                  type="folder"
                  value={groupPath}
                  onChange={val => setGroupPath(val)}
                  dialogTitle="Select a Group Folder..."
                />
              </div>
              <br/>
              <WSFileName
                label="Group Name"
                value={groupName}
                onChange={val => setGroupName(val)}
                width="200px"
              />
            </>
          }

          {radioVal == 'existingGroup' &&
            <div className="flex align-items-end">
              <ObjectSelector
                label={`${label} Group`}
                type="genome_group"
                value={existingGroupPath}
                onChange={val => setExistingGroupPath(val)}
                dialogTitle="Select a Group Folder..."
                onlyUserVisible
              />
            </div>
          }

          <br/>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" disableRipple>
            Cancel
          </Button>
          <Button disabled={isDisabled()} onClick={handleCreate} color="primary" variant="contained" disableRipple>
            {inProgress ? 'creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}