import React from 'react'
import styled from 'styled-components'

import Step from '@material-ui/core/Step'
import StepIcon from '@material-ui/core/StepIcon'
import StepLabel  from '@material-ui/core/StepLabel'
import CheckIcon from '@material-ui/icons/Check'


const usageError = (propName, value) => (
  `StepComponent must have prop: ${propName}.  Value was: ${value}`
)


const StepComponent = (props) => {
  const {completed, number, label, noNumber} = props

  if (!label)
    throw usageError('label', label)
  if (!number && !noNumber)
    throw usageError('number', number)

  return (
    <>
      <Step active={true} completed={false}>
        <StepIcon icon={number} />
        <StepLabel>
          {label}
        </StepLabel>
        <CheckMark>
          {completed && <CheckIcon color="secondary" />}
        </CheckMark>
      </Step>
    </>
  )
}

const Root = styled.div`

`

const CheckMark = styled.span`
  position: relative;
  svg {
    position: absolute;
    top: -2px;
  }
`


export default StepComponent
