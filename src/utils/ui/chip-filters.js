// Todo: rename "items " to include label, ids, etc
import React from 'react'
import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  filterChip: {
    marginRight: theme.spacing(1)
  }
}));

export default function ChipFilters(props) {
  const styles = useStyles()

  const {onClick, filterState, items} = props;
  return (
    <span>
      {
        [...new Set(items.map(obj => obj.type))]
          .map(type => {
            const opts = filterState == type ? {} : {variant: 'outlined'}
            return (
              <Chip
                {...opts}
                color={filterState == type ? 'primary' : 'default'}
                key={type}
                clickable
                className={styles.filterChip}
                label={type}
                onClick={() => onClick(type)}
              />
            )
          })
      }
    </span>
  )
}
