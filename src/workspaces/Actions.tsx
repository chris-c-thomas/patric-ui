
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import ShareIcon from '@material-ui/icons/FolderSharedOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import LabelIcon from '@material-ui/icons/LocalOfferOutlined'
import CopyMoveIcon from '@material-ui/icons/FileCopyOutlined'
import RenameIcon from '@material-ui/icons/EditOutlined'

import ConfirmDialog from './ConfirmDialog'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import {deleteObjects, WSObject} from '../api/ws-api'



const Btn = (props) =>
  <Button size="small" variant="outlined" color="primary" disableRipple {...props}>
    {props.children}
  </Button>


type Props = {
  path: string
  selected: WSObject[]
  onUpdateList: () => void
}

export default function Actions(props: Props) {
  const { onUpdateList} = props

  const [selected, setSelected] = useState(props.selected || [])
  const [open, setOpen] = useState(false)
  const [snack, setSnack] = useState(null)

  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])


  const implement = () => {
    alert('Not implemented yet :(')
  }

  const handleDelete = () => {
    return deleteObjects(selected, true).then(() => {
      setSnack(`Deleted ${selected.length} items`)
      onUpdateList()
    })
  }

  return (
    <>
      <FileName>
        {selected.length == 1 &&
          <>{selected[0].name} <span>is selected</span></>
        }
        {selected.length > 1 &&
          <span>{selected.length} items are selected</span>
        }
      </FileName>

      <ActionContainer>
        <Btn startIcon={<ShareIcon />} onClick={() => implement()}>
          Share
        </Btn>
        {selected.length == 1 &&
          <Btn startIcon={<RenameIcon />} onClick={() => implement()}>
            Rename
          </Btn>
        }
        <Btn startIcon={<CopyMoveIcon />} onClick={() => implement()}>
          Move or Copy
        </Btn>
        {selected.length == 1 &&
          <Btn startIcon={<LabelIcon />} onClick={() => implement()}>
            Edit Type
          </Btn>
        }
        <Btn startIcon={<DeleteIcon />} onClick={() => setOpen(true)} className="failed">
          Delete
        </Btn>

        {open &&
          <ConfirmDialog
            title="Are you sure?"
            content={`Are you sure you want to delete ${selected[0].name}?`}
            loadingText="Deleting..."
            onConfirm={handleDelete}
            onClose={() => setOpen(false)}
          />
        }

        {snack &&
          <Snackbar open autoHideDuration={5000} onClose={() => setSnack(null)}>
            <Alert onClose={() => setSnack(null)} severity="success">
              {snack}
            </Alert>
          </Snackbar>
        }
      </ActionContainer>
    </>
  )
}


const FileName = styled.div`
  font-weight: bold;
  font-size: 1.1em;

  span {
    font-size: .85em;
    font-weight: normal;
  }
`

const ActionContainer = styled.div`
`
