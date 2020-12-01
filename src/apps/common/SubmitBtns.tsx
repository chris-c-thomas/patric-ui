import React, {useState, useEffect} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import Button from '@material-ui/core/Button'

import { Section } from './FormLayout'


const usageError = (propName, value) => (
  `The SubmitBtns component (for use in the service forms) ` +
  `must have prop '${propName}' so that the user is notified of submission progress.  Value was: ${value}`
)

type Props = {
  disabled: boolean;
  status: string | {error: object};
  onSubmit: () => void;
  onReset: () => void;
}

export default function SubmitBtns(props: Props) {
  const {
    disabled = false,
    status,
    onSubmit,
    onReset
  } = props

  const params = new URLSearchParams(useLocation().search)
  const history = useHistory()


  if (typeof disabled == 'undefined')
    throw usageError('disabled', disabled)
  if (typeof status == 'undefined')
    throw usageError('status', status)

  const [state, setState] = useState(null)

  useEffect(() => {
    setState(status)
  }, [status])


  const handleReset = () => {
    // ensure url is updated on reset
    params.delete('input')
    history.push({search: params.toString()})
    onReset()
  }

  return (
    <Section spaceBetween>
      <Button
        onClick={onSubmit}
        variant="contained"
        color="primary"
        className="no-raised"
        disableRipple
        disabled={disabled || status == 'starting'}
      >
        {state == 'starting' ? 'Submitting...' : 'Submit'}
      </Button>

      <Button onClick={handleReset} disableRipple>
        Reset
      </Button>
    </Section>
  )
}