
import React from 'react'

import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/PlayCircleOutlineRounded'


type Props = {
  onAdd: () => void
  disable?: boolean
  [rest: string]: any
}

const AddButton = (props: Props) => {
  const {onAdd, disabled = false, ...rest} = props

  return (
    <Tooltip
      title={<>{disabled ? 'First, select some read files' : 'Add item to selected libraries'}</>}
      placement="top"
    >
      <span>
        <Button
          aria-label="add item"
          onClick={onAdd}
          disabled={disabled}
          color="primary"
          endIcon={<AddIcon />}
          disableRipple
          {...rest}
        >
          Add
        </Button>
      </span>
    </Tooltip>
  )
}


export default AddButton