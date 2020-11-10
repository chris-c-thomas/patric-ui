
import React from 'react'

import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/PlayCircleOutlineRounded'


type Props = {
  onClick: () => void
  disable?: boolean
  [rest: string]: any
}

const AddButton = (props: Props) => {
  const {disabled = false, ...rest} = props

  return (
    <Tooltip
      title={<>{disabled ? 'First, select an item' : 'Add item to table'}</>}
      placement="top"
    >
      <span>
        <Button
          aria-label="add item"
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