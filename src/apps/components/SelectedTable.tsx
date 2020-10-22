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
      label: 'Reads',
      id: 'name'
    }, {
      label: 'Platform',
      id: 'platform'
    }]
 *
 */

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import RemoveIcon from '@material-ui/icons/CloseRounded'
import InfoIcon from '@material-ui/icons/InfoOutlined'



const noSelection = (emptyNotice, columnCount) => (
  <tr>
    <td colSpan={columnCount} className="muted">
      {emptyNotice ? emptyNotice : `No items currently selected`}
    </td>
  </tr>
)

const Cell = ({row, col, index, onRemove, ...rest}) => {
  if (col.button == 'removeButton') {
    return (
      <td>
        <RmBtn size="small" onClick={() => onRemove({row, index})}>
          <RemoveIcon />
        </RmBtn>
      </td>
    )
  } else if (col.button == 'infoButton') {
    return (
      <td>
        <InfoBtn size="small">
          <InfoIcon />
        </InfoBtn>
      </td>
    )
  } else {
    return (
      <td style={{wordBreak: 'break-all', width: rest.width}}>
        {'format' in col ? col.format(row[col.id], row) : row[col.id]}
      </td>
    )
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
        <Cell key={j} index={index} row={row} col={col} onRemove={onRemove} {...col} />
      )}
    </tr>
  )


type Column = {
  id?: string
  label?: string | (() => JSX.Element)
  width?: string | number
  button?: 'removeButton' | 'infoButton' | string
  format?: (value: any, row: object) => string | JSX.Element
}

type Props = {
  columns: Column[]
  rows: object[]
  emptyNotice?: string | JSX.Element
  onRemove?: ({row: object, index: number}) => void
}

export default function SelectedTable(props: Props) {
  const {
    emptyNotice,
    onRemove,
  } = props

  const [rows, setRows] = useState(props.rows || [])
  const [columns] = useState(props.columns || [])

  useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  return (
    <Root>
      <Table className="simple striped dense">
        <thead>
          <tr>
            {/* all <th> elements that are not buttons */
              columns.filter(col => !('button' in col))
                .map((col) =>
                  <th key={col.id} style={{width: col.width}}>
                    {typeof col.label == 'function' ? col.label() : col.label}
                  </th>
                )}
            {/* empty <th> elements for buttons */
              columns.filter(col => 'button' in col)
                .map((col) => <th key={col.id} style={{width: 1}}></th>)
            }
          </tr>
        </thead>
        <tbody>
          {!rows.length &&
            noSelection(emptyNotice, columns ? columns.length + 1 : 2)
          }
          {rows.length > 0 &&
            <Rows {...{columns, rows, onRemove}} />
          }
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


