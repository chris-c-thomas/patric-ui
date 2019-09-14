/**
 * SelectedTable
 *
 * This component displays a selection of "items".
 *
 * Props:
 *  columns - a description of the rows (not including delete). see below.
 *    in the format below.
 *  items - any default items to be provided to the component
 *
 * Examples:
 *
    columns: [{
      name: 'Reads',
      key: 'name'
    }, {
      name: 'Platform',
      key: 'platform'
    }]

    items: [{
      name: 'Reads',
      key: 'name'
    }, {
      name: 'Platform',
      key: 'platform'
    }]

 *
 */

import React, {useState, useEffect} from 'react';
import IconButton from '@material-ui/core/IconButton';
import RemoveButton from '@material-ui/icons/CloseRounded';


const usageError = (propName, value) => (
  `SelectedTable component must have prop: ${propName}.  Value was: ${value}`
)

const defaultColumns = [{
  name: 'Reads',
  key: 'name'
}, {
  name: 'Platform',
  key: 'platform'
}]

const noSelection = (columns) => (
  <tr>
    <td colSpan={columns.length + 1} className="muted italic">
      No {columns[0].name.toLowerCase()} currently selected.
    </td>
  </tr>
)

const getRows = (props) => {
  const {items, columns, onRemove } = props;

  return items.map((item, index) => {
    return <tr key={index}>
      {columns.map((col, j) => <td key={j}>{item[col.key]}</td>)}
      <td>
        <IconButton size="small" onClick={() => onRemove({item, index})}>
          <RemoveButton />
        </IconButton>
      </td>
    </tr>
  })
}

export default function SelectedTable(props) {
  let { columns, onRemove } = props

  const [items, setItems] = useState(props.items || [])

  useEffect(() => {
    setItems(props.items);
  }, [props.items])

  if (!columns) {
    columns = defaultColumns;
  }

  return (
    <table className="simple hover dense">
      <thead>
        <tr>
          {columns.map((col, i) => <th key={i}>{col.name}</th>)}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {!items.length && noSelection(columns)}
        {items.length > 0 && getRows({columns, items, onRemove})}
      </tbody>
    </table>
  )
}