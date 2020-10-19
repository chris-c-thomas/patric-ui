import React from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';



const MenuButton = ({children, open, ...props}) => {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={props.startIcon}
        endIcon={props.endIcon}
        disableRipple
        {...props}
      >
        {props.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl) || Boolean(props.open)}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </>
  )
}

export default MenuButton



