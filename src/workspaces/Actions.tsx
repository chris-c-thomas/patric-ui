
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

import ClearIcon from '@material-ui/icons/Clear'
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
  <Button variant="outlined" color="primary" disableRipple {...props}>
    {props.children}
  </Button>


type Props = {
  path: string
  selected: WSObject[]
  onClear: () => void
  onUpdateList: () => void
}

export default function Actions(props: Props) {
  const {onClear, onUpdateList} = props

  const [selected, setSelected] = useState(props.selected || [])
  const [open, setOpen] = useState(false)
  const [snack, setSnack] = useState('')

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
          selected[0].name
        }
        {selected.length > 1 &&
          `${selected.length} items`
        }
      </FileName>

      <ActionContainer>
        <IconButton onClick={onClear} size="small" disableRipple>
          <ClearIcon />
        </IconButton>
        <Btn startIcon={<ShareIcon />} onClick={() => implement()}>
          Share
        </Btn>
        <Btn startIcon={<RenameIcon />} onClick={() => implement()}>
          Rename
        </Btn>
        <Btn startIcon={<CopyMoveIcon />} onClick={() => implement()}>
          Move or Copy
        </Btn>
        <Btn startIcon={<LabelIcon />} onClick={() => implement()}>
          Edit Type
        </Btn>
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
          <Snackbar open={true} autoHideDuration={5000} onClose={() => setSnack(null)}>
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
`

const ActionContainer = styled.div`
`
