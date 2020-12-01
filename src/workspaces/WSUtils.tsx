import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'

import ChartIcon from '@material-ui/icons/BarChartRounded'
import CaretIcon from '@material-ui/icons/ArrowDropDownRounded'



export const isWorkspace = path =>
  (path.match(/\//g) || []).length == 1



export const Btn = (props) =>
  <Button size="small" variant="outlined" color="primary" disableRipple {...props}>
    {props.children}
  </Button>


export const IconBtn = ({title, ...props}) =>
  <Tooltip placement="top" title={title || ''}>
    <IconButton color="primary" disableRipple {...props}>
      {props.icon}
    </IconButton>
  </Tooltip>





type RunJobMenuProps = {
  children: JSX.Element[]
}

export const RunJobMenu = (props: RunJobMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (evt) => {
    // evt.preventDefault()

    setAnchorEl(evt.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Btn
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        startIcon={<ChartIcon/>}
        endIcon={<CaretIcon/>}
      >
        Run Service
      </Btn>
      <Menu
        id="simple-menu"
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




