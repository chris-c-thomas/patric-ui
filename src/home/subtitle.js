import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function Subtitle({inline, ...props}) {
  const {children} = props;
  return (
    <Typography
      variant="h6"
      style={inline ? {display: 'inline', marginRight: '10px'} : {}}
      {...props}
    >
      {children}
    </Typography>
  );
}