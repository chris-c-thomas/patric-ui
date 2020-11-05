//
// todo(nc): reveal password option
// todo(nc): style error messages
//
import React, {useState} from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import LockIcon from '@material-ui/icons/LockOutlined'
import { Step, StepIcon, StepLabel } from '@material-ui/core'


import TextInput from '../apps/components/TextInput'

import * as Auth from '../api/auth'


type Props = {
  type?: 'service' | 'workspace'
}


export default function SignInDialog(props: Props) {
  const {type} = props

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const [inProgress, setInProgress] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [failMsg, setFailMsg] = useState(null)

  const handleSignIn = evt => {
    evt.preventDefault()

    setInProgress(true)

    Auth.signIn(user, pass, type != 'workspace')
      .then((fullUsername) => {
        if (type == 'workspace')
          window.location.href = `/files/${fullUsername}/home`

      }).catch(err => {
        setInProgress(false)

        const error = err.response.data
        const status = error.status

        if (status == 401) {
          setIsInvalid(true)
          return
        }

        const msg = err.response.data.message
        setFailMsg(msg)
      })
  }

  return (
    <Form onSubmit={handleSignIn} className="flex-column justify-center">
      {type == 'service' &&
        <Step active={true} completed={false}>
          <StepIcon icon={<div><LockIcon /></div>} />
          <StepLabel>Please sign in to use this service</StepLabel>
        </Step>
      }

      <TextInput label="Username" value={user} onChange={val => setUser(val)} autoFocus/>
      <TextInput label="Password" type="password" value={pass} onChange={val => setPass(val)}/>

      {isInvalid && <div>Invalid username and/or password</div>}
      {failMsg && <div>{failMsg}</div>}

      <div>
        <Button color="primary"
          variant="contained"
          disabled={!user || !pass || inProgress}
          type="submit"
          disableRipple
        >
          {inProgress ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </Form>
  )
}


const Form = styled.form`
  margin: 0 auto;
  padding: 20px;
  max-width: 250px;

  button {
    margin: 20px 0;
  }

  .MuiInputBase-root {
    margin-bottom: 5px
  }
`