import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'

import ChartIcon from '@material-ui/icons/BarChartRounded'
import CaretIcon from '@material-ui/icons/ArrowDropDownRounded'




type Props = {
  button?: JSX.Element
  children: JSX.Element | JSX.Element[]
}

export default function MenuComponent(props: Props) {
  const {
    button
  } = props

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (evt) => {
    setAnchorEl(evt.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      {button ? React.cloneElement(button, {onClick: handleClick})  :
        <IconButton
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          Menu
        </IconButton>
      }
      <Menu
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {props.children}
      </Menu>
    </div>
  )
}


