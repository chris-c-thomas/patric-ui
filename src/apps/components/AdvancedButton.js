import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import ArrowDown from '@material-ui/icons/ArrowDropDownRounded'
import ArrowUp from '@material-ui/icons/ArrowDropUpRounded'



const usageError = (propName, value) => (
  `AdvancedButton component must have prop: ${propName}.  Value was: ${value}`
)

export default function AdvancedButton(props) {
  const [open, setOpen] = useState(false)
  const {onClick, label, ...rest} = props

  if (!onClick) throw usageError('onClick', onClick)

  const handleClick = () => {
    setOpen(!open)
    onClick(!open)
  }

  return (
    <Button
      className="align-self-start"
      style={{margin: '5px 0'}}
      onClick={handleClick}
      size="small"
      disableRipple
      {...rest}
    >
      {!open ?
        `${label ? label : 'Advanced'}` :
        `Hide ${label ? label.toLowerCase() : 'advanced'}`
      }
      {!open ? <ArrowDown /> : <ArrowUp /> }
    </Button>
  )
}


