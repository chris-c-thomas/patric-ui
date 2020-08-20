/**
 * Todo: add column search
 *
*/
import React, { useState, useEffect} from 'react';
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener  from '@material-ui/core/ClickAwayListener'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import SettingsIcon from '@material-ui/icons/Settings';
import Caret from '@material-ui/icons/ArrowDropDown';

import Checkbox from './checkbox'

export default function ColumnMenu({columns, onChange}) {
  const [open, setOpen] = useState(false);

  const initSelected = columns.reduce((obj, col) => {
    obj[col.id] = !col.hide || false
    return obj;
  }, {})
  const [selected, setSelected] = useState(initSelected);

  const handleClick = () => {
    setOpen(prev => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleChange = (col) => {
    const showCol = !selected[col.id]
    const newState = {...selected, [col.id]: showCol}
    setSelected(newState)

    // don't delete checkbox
    setTimeout(() => {
      onChange(col, showCol)
    })
  };


  const controls = columns.map((col) => {
    return (
      <div key={col.id}>
        <FormControlLabel
          control={
            <Checkbox checked={selected[col.id]} onChange={() => handleChange(col)}/>
          }
          label={col.label || col.id}
        />
      </div>
    )
  })

  return (
    <Root>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <Button onClick={handleClick} size="small" variant="outlined" disableRipple>
            <SettingsIcon /> <Caret />
          </Button>
            {open ? (
              <DropDown>
                {controls}
              </DropDown>
            ) : null}
        </div>
      </ClickAwayListener>
    </Root>
  );
}


const Root = styled.div`
  position: relative;
  z-index: 9999;
`

const DropDown = styled(Paper)`
  position: absolute;
  top: 36;
  right: 0;
  min-width: 300px;
  max-height: 400px;
  overflow: scroll;
  padding: 10px;
`
