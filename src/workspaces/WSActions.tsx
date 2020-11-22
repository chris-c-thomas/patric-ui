
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import ShareIcon from '@material-ui/icons/FolderSharedOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import LabelIcon from '@material-ui/icons/LocalOfferOutlined'
import CopyMoveIcon from '@material-ui/icons/FileCopyOutlined'
import RenameIcon from '@material-ui/icons/EditOutlined'

import ConfirmDialog from './ConfirmDialog'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import {deleteObjects, omitSpecialFolders} from '../api/ws-api'
import {WSObject} from '../api/workspace.d'

import {isWorkspace, IconBtn} from './WSUtils'


type Props = {
  path: string
  selected: WSObject[]
  viewType?: 'jobResult' | 'objectSelector' | 'file'
  onUpdateList: () => void
}

const WSActions = (props: Props) => {
  const {
    path,
    viewType,
    onUpdateList,
  } = props

  const [selected, setSelected] = useState(props.selected || [])
  const [open, setOpen] = useState(false)
  const [snack, setSnack] = useState(null)

  const [notAllowedMsg, setNotAllowedMsg] = useState<string>(null)


  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])


  const implement = () => {
    alert('Not implemented yet.  Coming soon.')
  }

  const openDeleteDialog = () => {
    const paths = selected.map(o => o.path)
    try {
      omitSpecialFolders(paths, 'delete')
      setOpen(true)
    } catch (errStr) {
      setNotAllowedMsg(errStr)
    }
  }

  const handleDelete = () => {
    return deleteObjects(selected, true).then(() => {
      setSnack(`Deleted ${selected.length} item${selected.length > 1 ? 's' : ''}`)
      onUpdateList()
    })
  }

  const shouldShowActions = () =>
    viewType != 'objectSelector' &&
    !path.startsWith('/public') &&
    !path.startsWith('/shared-with-me')


  return (
    <>
      {shouldShowActions() &&
        <>
          {isWorkspace(path) &&
            <IconBtn title="Share workspace" icon={<ShareIcon />} onClick={() => implement()} />
          }

          {selected.length == 1 &&
            <IconBtn title="Rename item" icon={<RenameIcon />} onClick={() => implement()} />
          }

          <IconBtn title="Move or copy" icon={<CopyMoveIcon />} onClick={() => implement()} />

          {selected.length == 1 &&
            <IconBtn title="Edit item type" icon={<LabelIcon />} onClick={() => implement()} />
          }

          <IconBtn title="Delete" icon={<DeleteIcon />} className="failed"  onClick={openDeleteDialog} />
        </>
      }

      {open &&
        <ConfirmDialog
          title="Are you sure?"
          content={<>
            Are you sure you want to delete{' '}
            <b>{selected.length > 1 ? `${selected.length} items` : selected[0].name}</b>?
          </>}
          loadingText="Deleting..."
          onConfirm={handleDelete}
          onClose={() => setOpen(false)}
        />
      }

      {notAllowedMsg &&
        <ConfirmDialog
          title="Sorry, you can't delete that."
          content={<div dangerouslySetInnerHTML={{__html: notAllowedMsg}}></div>}
          onConfirm={() => setNotAllowedMsg(null)}
          onClose={() => setNotAllowedMsg(null)}
        />
      }

      {snack &&
        <Snackbar open autoHideDuration={5000} onClose={() => setSnack(null)}>
          <Alert onClose={() => setSnack(null)} severity="success">
            {snack}
          </Alert>
        </Snackbar>
      }

    </>
  )
}


const Root = styled.div`

`


export default WSActions

