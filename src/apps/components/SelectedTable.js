/**
 * SelectedTable
 *
 * This component displays a selection of "rows".
 *
 * Props:
 *  columns - a description of the rows (not including delete). see below.
 *    in the format below.
 *  rows - default rows to be provided to the component
 *
 * Examples:
 *
    columns: [{
      name: 'Reads',
      id: 'name'
    }, {
      name: 'Platform',
      id: 'platform'
    }]
 *
 */

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import RemoveIcon from '@material-ui/icons/CloseRounded'
import InfoIcon from '@material-ui/icons/InfoOutlined'


const defaultColumns = [{
  name: 'Reads',
  id: 'name'
}, {
  name: 'Platform',
  id: 'platform'
}]

const noSelection = (emptyNotice, columns) => (
  <tr>
    <td colSpan={columns.length + 1} className="muted">
      {emptyNotice ?
        emptyNotice :
        `No ${typeof col.label == 'function' ? col.label() : col.label.lowerCase()} currently selected.`
      }
    </td>
  </tr>
)

const buttonTypes = ['removeButton', 'infoButton']

const Cell = ({row, col, index, onRemove}) => {
  if (col.type == 'removeButton') {
    return (
      <td>
        <RmBtn size="small" onClick={() => onRemove({row, index})}>
          <RemoveIcon />
        </RmBtn>
      </td>
    )
  } else if (col.type == 'infoButton') {
    return (
      <td>
        <InfoBtn size="small">
          <InfoIcon />
        </InfoBtn>
      </td>
    )
  } else {
    return <td style={{wordBreak: 'break-all'}}>{row[col.id]}</td>
  }
}

const RmBtn = styled(IconButton)`
  .MuiSvgIcon-root {
    font-size: 1rem;
  }
`

const InfoBtn = styled(IconButton)`
  .MuiSvgIcon-root {
    font-size: 1rem;
  }
`

const Rows = ({rows, columns, onRemove }) =>
  rows.map((row, index) =>
    <tr key={index}>
      {columns.map((col, j) =>
        <Cell key={j} index={index} row={row} col={col} onRemove={onRemove} />
      )}
    </tr>
  )


export default function SelectedTable(props) {
  const { columns, onRemove, emptyNotice } = props

  const [rows, setRows] = useState(props.rows || [])

  useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  if (!columns) {
    columns = defaultColumns;
  }

  return (
    <Root>
      <Table className="simple striped dense">
        <thead>
          <tr>
            {/* all <th> elements that are not buttons */
              columns.filter(col => !(col.type in buttonTypes))
              .map((col, i) =>
                <th key={i}>
                  {typeof col.label == 'function' ? col.label() : col.label}
                </th>
              )}
            {/* empty <th> elements for buttons */
              columns.filter(col => col.type in buttonTypes)
                .map(() => <th style={{width: 1}}></th>)
            }
          </tr>
        </thead>
        <tbody>
          {!rows.length && noSelection(emptyNotice, columns)}
          {rows.length > 0 && <Rows {...{columns, rows, onRemove}} />}
        </tbody>
      </Table>
    </Root>
  )
}

const Root = styled.div`
  border: 1px solid #ddd;
  max-height: 280px;
  overflow: scroll;
`

const Table = styled.table`
  thead tr th {
    background: #fff;
    position: sticky;
    top: 0;

  }
`


