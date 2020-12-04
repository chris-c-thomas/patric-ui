
import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import ShareIcon from '@material-ui/icons/FolderSharedOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import LabelIcon from '@material-ui/icons/LocalOfferOutlined'
import CopyMoveIcon from '@material-ui/icons/FileCopyOutlined'
import RenameIcon from '@material-ui/icons/EditOutlined'

import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import ConfirmDialog from './ConfirmDialog'

import {deleteObjects, omitSpecialFolders} from '../api/ws-api'
import {WSObject} from '../api/workspace.d'
import {isWorkspace,IconBtn, RunJobMenu} from './WSUtils'

import {inputSpec, getParams} from './runServiceSpec'




type ServiceOpt = {label: string, url: string}


const getRunnableApps = (selected: WSObject[]) : ServiceOpt[]  => {
  // all files must be the same type
  if (!selected.length || [...new Set(selected.map(obj => obj.type))].length > 1)
    return

  const {type} = selected[0]

  // get all possible apps
  const apps = Object.keys(inputSpec)
    .filter(key => inputSpec[key].inputTypes.includes(type))

  // filter out anything that doesn't have params
  // and convert to options (with url)
  const options = apps
    .filter(label => Object.keys(getParams(selected, label)).length)
    .map(label => ({
      label,
      url: `/apps/${label}/?input=${JSON.stringify(getParams(selected, label))}`
    }))

  return options
}



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

          <Divider orientation="vertical" flexItem style={{marginRight: 15}}/>

          {selected.length <= 2 && getRunnableApps(selected)?.length > 0 &&
            <>
              <RunJobMenu>
                {getRunnableApps(selected)
                  .map(({label, url}) =>
                    <MenuItem
                      key={label}
                      component={Link}
                      to={url}
                      style={{minWidth: 175}}
                    >
                      {label}
                    </MenuItem>
                  )
                }
              </RunJobMenu>

              <Divider orientation="vertical" flexItem style={{marginRight: 15}}/>
            </>
          }
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




export default WSActions

