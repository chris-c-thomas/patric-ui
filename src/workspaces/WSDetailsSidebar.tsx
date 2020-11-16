import React from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/InfoOutlined'

import Slide from '@material-ui/core/Slide'

import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'


import { getIcon } from './FileList'
import { permissionMap } from '../api/ws-api'
import { WSObject } from '../api/workspace.d'
import { isoToHumanDateTime } from '../utils/units'
import { getUser } from '../api/auth'



const PermissionsList =  (props: WSObject) => {
  const { permissions, userPerm, owner } = props

  return (
    <MembersContainer>
      <h3>Workspace Memebers</h3>

      <ul className="list-style-none no-margin">
        <li>
          {userPerm == 'o' ? `${getUser()} (me) - Owner` : `${owner} - Owner`}
        </li>
        {permissions
          .filter(perm => perm[0] != 'global_permission')
          .map(perm => {
            const user = perm[0].split('@')[0]
            return (
              <li key={user}>
                {user == getUser() ? `${user} (me)` : `${user} - ${permissionMap(perm[1])}`}
              </li>
            )
          })
        }
      </ul>
    </MembersContainer>
  )
}

const MembersContainer = styled.div`
  margin-top: 50px;

  h3 {
    margin-bottom: 5px;
  }
`


const MetaTable = (props: WSObject) => {
  const {
    type, owner, created, path
  } = props

  return (
    <table className="key-value">
      <tbody>
        <tr><td>Type:</td><td>{type}</td></tr>
        <tr><td>Owner:</td><td>{owner}</td></tr>
        <tr><td>Created:</td><td>{isoToHumanDateTime(created)}</td></tr>
        <tr><td>Path:</td><td>{path}</td></tr>
      </tbody>
    </table>
  )
}



type Props = {
  selection: WSObject[]
  onClose: () => void
}


export default function DetailsSidebar(props: Props) {
  const {selection, onClose} = props


  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Root className="meta-sidebar">
        <Title className="flex align-items-center space-between">
          <div className="flex align-items-center">
            <div>
              {selection.length == 1 && getIcon(selection[0])}
            </div>
            <div className="title">
              {selection.length == 1 ? selection[0].name : 'Details'}
            </div>

          </div>

          <div>
            <IconButton size="small" onClick={() => onClose()} disableRipple>
              <CloseIcon/>
            </IconButton>
          </div>
        </Title>

        {selection.length == 1 &&
          <>
            <MetaTable {...selection[0]} />
            <PermissionsList {...selection[0]} />
          </>
        }

        {selection.length > 1 &&
          <Alert icon={<InfoIcon />} severity="info">
            <AlertTitle>{selection.length} items selected</AlertTitle>
          </Alert>
        }

        {selection.length < 1 &&
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
  padding: 0 8px;
  border-left: 1px solid #c3c3c3;

  font-size: 13px;
  overflow-y: scroll;
`

const Title = styled.div`
  margin: 15px 0;

  .title {
    font-weight: bold;
    font-size: 1.5em;
  }
`
