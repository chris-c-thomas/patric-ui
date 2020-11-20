import React from 'react'
import Button from '@material-ui/core/Button'


export const Btn = (props) =>
  <Button size="small" variant="outlined" color="primary" disableRipple {...props}>
    {props.children}
  </Button>


export const isWorkspace = path =>
  (path.match(/\//g) || []).length == 1