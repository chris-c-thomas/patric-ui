/* eslint-disable react/display-name */
/**
 * Paired Read Selector
 *
 * Todo:
 *  - provide onAdd/onRemove methods?
 *
 */

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import { parsePath } from '../../utils/paths'
import ObjectSelector from './object-selector/ObjectSelector'
import SelectedTable from './SelectedTable'
import AddButton from '../common/AddButton'
import AddIcon from '@material-ui/icons/Add'

import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'
import HelpIcon from '@material-ui/icons/HelpOutlineRounded'
import FormHelperText from '@material-ui/core/FormHelperText'


type PairedEndLib = {read1: string, read2: string}

type ReadTypes = 'paired_end_libs'

type TableRow = {
  label: string
  type: ReadTypes
  value: PairedEndLib
}


const columns = [{
  id: 'label',
  label: () =>
    <div>
      Selected Libraries
      <Tooltip
        title="Read libraries placed here will contribute to a single assembly"
        placement="top"
      >
        <HelpIcon color="primary" className="hover" style={{fontSize: '1.2em'}}/>
      </Tooltip>
    </div>
}, {
  button: 'removeButton'
}]
// { button: 'infoButton'} // todo: implement?


const getTableRow = (read: PairedEndLib) : TableRow => {
  if (typeof read == 'object' && 'read1' in read && 'read2' in read)
    return {
      label: `${parsePath(read.read1).name}, ${parsePath(read.read2).name} (paired)`,
      type: 'paired_end_libs',
      value: read
    }
  else
    throw 'getTableRow: Could not determine table row for selected read library table'
}



type Props = {
  onChange: (field: ReadTypes, val: PairedEndLib[]) => void
  advancedOptions?: boolean
  paired_end_libs: PairedEndLib[]
}

export default function PairedReadSelector(props: Props) {
  const { onChange, advancedOptions} = props

  // data state
  // const [state, setState] = useState(getTableRows(props.reads))
  const [pairedEnds, setPairedEnds] = useState<PairedEndLib[]>(props.paired_end_libs)
  const [tableRows, setTableRows] = useState([])

  // currently selected paths (for single paired reads)
  const [read1, setRead1] = useState(null)
  const [read2, setRead2] = useState(null)

  // advanced options (todo: implement)
  const [advOpen, setAdvOpen] = useState(false)

  const [interleaved, setInterleaved] = useState('false')
  const [read_orientation_outward, setMatePaired] = useState('false')
  const [platform, setPlatform] = useState('infer')


  useEffect(() => {
    setPairedEnds(props.paired_end_libs)

    const allReads = [
      ...props.paired_end_libs,
    ]
    setTableRows(allReads.map(obj => getTableRow(obj)))
  }, [props.paired_end_libs])

  const onAddPaired = () => {
    let row = {
      read1,
      read2,
      platform,
      interleaved,
      read_orientation_outward
    }

    onChange('paired_end_libs', [...pairedEnds, row])

    // clear inputs
    setRead1(null)
    setRead2(null)
  }

  const onRemove = ({index}) => {
    const {type, value} = tableRows[index]

    if (type == 'paired_end_libs')
      onChange(type, pairedEnds.filter(({read1, read2}) => read1 != value.read1 && read2 != value.read2))
  }

  const isPairedInList = (path1, path2) => {
    if (!path1 && !path2) return
    return !!pairedEnds.filter(obj =>
      (obj.read1 == path1 && obj.read2 == path2) ||
      (obj.read2 == path1 && obj.read1 == path2)
    ).length
  }

  return (
    <Root>
      <Inputs>

        <Row>
          <Column>
            <InputLabel shrink>
              Paired Read Library
            </InputLabel>
            <Row>
              <ObjectSelector
                value={read1}
                onChange={val => setRead1(val)}
                type="reads"
                dialogTitle="Select read file"
                placeholder="Read file 1"
              />
            </Row>
            <Row>
              <ObjectSelector
                value={read2}
                onChange={val => setRead2(val)}
                type="reads"
                dialogTitle="Select read file 2"
                placeholder="Read file 2"
              />
            </Row>
            {read1 && read2 && read1 == read2 &&
              <FormHelperText error>
                Paired-end read files can not be the same
              </FormHelperText>
            }

            {isPairedInList(read1, read2) &&
              <FormHelperText error>
                These paired-end read files are already in the selected libraries list
              </FormHelperText>
            }
          </Column>


          <div className="align-self-center" >
            <AddButton
              onClick={() => onAddPaired()}
              startIcon={<AddIcon />}
              endIcon={false}
              disabled={!read1 || !read2 || read1 == read2 || isPairedInList(read1, read2)}
              style={{marginTop: 12}}
            />
          </div>

        </Row>

      </Inputs>

      <TableContainer>
        <SelectedTable
          columns={columns}
          rows={tableRows}
          onRemove={onRemove}
          emptyNotice={<i>Place read files here using the fields to the left</i>}
        />
      </TableContainer>

    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex: 1;
`

const Inputs = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
  & > div {
    margin-bottom: 10px;
  }
`

const TableContainer = styled.div`
  flex: 1;
  margin: 0 5px;
`

const Row = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 3px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`


