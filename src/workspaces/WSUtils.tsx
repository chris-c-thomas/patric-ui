import React from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'


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


export const isWorkspace = path =>
  (path.match(/\//g) || []).length == 1