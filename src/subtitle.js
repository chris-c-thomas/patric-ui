import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function Subtitle({inline, noUpper, ...props}) {
  const {children} = props;

  let styles = inline ? {display: 'flex', alignItems: 'center', marginRight: '10px'} : {};
  styles = noUpper ? {textTransform: 'none', ...styles} : { ...styles}

  return (
    <Typography
      className="title"
      variant="h6"
      style={styles}
      {...props}
    >
      {children}
    </Typography>
  );
}