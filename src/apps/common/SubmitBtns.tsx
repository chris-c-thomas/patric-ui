import React, {useState, useEffect} from 'react'
import Button from '@material-ui/core/Button'

import { Section, Row } from './FormLayout'


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
  const {disabled = false, status, onSubmit, onReset} = props

  if (typeof disabled == 'undefined')
    throw usageError('disabled', disabled)
  if (typeof status == 'undefined')
    throw usageError('status', status)

  const [state, setState] = useState(null)

  useEffect(() => {
    setState(status)
  }, [status])

  return (
    <Section>
      <Row spaceBetween>
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

        <Button onClick={onReset} disableRipple>
          Reset
        </Button>
      </Row>
    </Section>
  )
}