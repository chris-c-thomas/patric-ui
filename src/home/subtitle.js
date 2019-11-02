import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function Subtitle(props) {
  const { children } = props;
  return (
    <Typography variant="h6"
      style={props.inline ? {display: 'inline', marginRight: '10px'} : {}}>
      {children}
    </Typography>
  );
}