/* eslint-disable react/display-name */
/**
 * Read Selector
 *
 * Todo:
 *  - provide onAdd/onRemove methods?
 *
 */

import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'

import { parsePath } from '../../utils/paths'
import {validateSRR} from '../../api/ncbi-eutils'
import ObjectSelector from './object-selector/ObjectSelector'
import SelectedTable from './SelectedTable'
import TextInput from './TextInput'
import AddButton from '../common/AddButton'
import AddIcon from '@material-ui/icons/Add'
//import ArrowIcon from '@material-ui/icons/ArrowForwardRounded'
import Progress from '@material-ui/core/CircularProgress'

import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'
import HelpIcon from '@material-ui/icons/HelpOutlineRounded'
import FormHelperText from '@material-ui/core/FormHelperText'


type PairedEndLib = {read1: string, read2: string}
type SingleEndLib = {read: string}
type SRRID = string

type Reads = {
  paired_end_libs: PairedEndLib[],
  single_end_libs: SingleEndLib[]
  srr_ids: SRRID[]
}

type TableRow = {
  label: string,
  type: 'paired' | 'single' | 'srr',
  value: PairedEndLib | SingleEndLib | SRRID
}[]


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
},
// { button: 'infoButton'} // todo: implement
]


const getTableRow = (read: PairedEndLib | SingleEndLib | SRRID) : TableRow => {
  if (typeof read == 'object' && 'read' in read )
    return {
      label: parsePath(read.read).name,
      type: 'single',
      value: read
    }
  else if (typeof read == 'object' && 'read1' in read && 'read2' in read)
    return {
      label: parsePath(read.read1).name + ', ' + parsePath(read.read2).name,
      type: 'paired',
      value: read
    }
  else if (typeof read == 'string')
    return {
      label: read,
      type: 'srr',
      value: read
    }
  else
    throw 'getTableRow: Could not determine table row for selected read library table'
}

const getTableRows = (reads: Reads) => {
  const {paired_end_libs = [], single_end_libs = [], srr_ids = []} = reads

  return [
    ...paired_end_libs,
    ...single_end_libs,
    ...srr_ids
  ].map(read => getTableRow(read))
}


const getState = (tableRows: TableRow[]) : Reads => {
  return {
    paired_end_libs: tableRows.filter(row => row.type == 'paired').map(o => o.value),
    single_end_libs: tableRows.filter(row => row.type == 'single').map(o => o.value),
    srr_ids: tableRows.filter(row => row.type == 'srr').map(o => o.value)
  }
}


type Props = {
  onChange: (object) => void
  advancedOptions?: boolean
  reads: Reads
}

export default function ReadSelector(props: Props) {
  const { onChange, advancedOptions} = props

  // data state
  const [tableRows, setTableRows] = useState(getTableRows(props.reads))

  // currently selected path (for single reads)
  const [read, setRead] = useState(null)

  // currently selected paths (for single paired reads)
  const [read1, setRead1] = useState(null)
  const [read2, setRead2] = useState(null)

  // current SRA ID input
  const [sraID, setSraID] = useState('')

  // advanced options (todo: implement)
  const [advOpen, setAdvOpen] = useState(false)

  const [interleaved, setInterleaved] = useState('false')
  const [read_orientation_outward, setMatePaired] = useState('false')
  const [platform, setPlatform] = useState('infer')

  const [validatingSRA, setValidatingSRA] = useState(false)
  const [sraMsg, setSRAMsg] = useState(null)
  const [sraError, setSRAError] = useState(null)


  const table = useMemo(() => getTableRows(props.reads), [props.reads])

  useEffect(() => {
    // optimization needed?
    setTableRows(table)
  }, [props.reads, table])


  function onAdd(type) {
    let row
    if (type == 'single') {
      row = {
        read,
        platform,
        interleaved,
        read_orientation_outward
      }

      setRead(null)
    } else if (type == 'paired') {
      row = {
        read1,
        read2,
        platform,
        interleaved,
        read_orientation_outward
      }

      setRead1(null)
      setRead2(null)
    } else {
      throw 'Could not reconize read type'
    }

    const newRows = [...tableRows, getTableRow(row)]
    onChange(getState(newRows))
  }


  const handleSRAChange = (val) => {
    // we want to clear the messages when a user types
    setSRAMsg(null)
    setSRAError(null)
    setSraID(val)
  }


  // when adding SRA, do some validation first
  const onAddSRA = async () => {
    setValidatingSRA(true)

    try {
      const {isValid} = await validateSRR(sraID)

      if (!isValid) {
        setValidatingSRA(false)
        setSRAError(`Your SRA ID ${sraID} is not valid`)
        return
      }

    } catch (err) {
      setValidatingSRA(false)

      const status = err.code == 'ECONNABORTED' ? 0 : err.response.status
      if (status >= 400 && status < 500) {
        setSRAError(`Your SRA ID ${sraID} is not valid`)
        return
      }

      setSRAMsg(`Note: we could not validate your SRA ID, but it was still added`)
    }

    const newRows = [...tableRows, getTableRow(sraID)]
    onChange(getState(newRows))

    setValidatingSRA(false)
    setSraID('')
  }


  const onRemove = ({index}) => {
    setTableRows(prev => {
      const newRows = prev.filter((_, i) => i != index)
      onChange(getState(newRows))
      return newRows
    })
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
          </Column>


          <div className="align-self-center" >
            <AddButton
              onClick={() => onAdd('paired')}
              startIcon={<AddIcon />}
              endIcon={false}
              disabled={!read1 || !read2 || read1 == read2 }
              style={{marginTop: 12}}
            />
          </div>

        </Row>

        <Row>
          <Column>
            <InputLabel shrink>
              Single Read Library
            </InputLabel>
            <Row>
              <ObjectSelector
                // noLabel
                value={read}
                onChange={val => setRead(val)}
                type="reads"
                dialogTitle="Select (single) read file"
                placeholder="Read file"
              />


              <div className="align-self-end" >
                <AddButton onClick={() => onAdd('single')}
                  startIcon={<AddIcon />}
                  endIcon={false}
                  disabled={!read}
                />
              </div>

            </Row>
          </Column>
        </Row>

        <Row>
          <Column>
            <InputLabel shrink>
              SRA Run Accession
            </InputLabel>
            <Row>
              <TextInput
                noLabel
                placeholder="SRR"
                value={sraID}
                onChange={handleSRAChange}
                error={!!sraError}
                helperText={sraMsg || sraError}
                style={{marginRight: 10}}
              />

              <div className="align-self-center">
                {validatingSRA ?
                  <Progress size="30" /> :
                  <AddButton
                    onClick={() => onAddSRA()}
                    startIcon={<AddIcon />}
                    endIcon={false}
                    disabled={!sraID}
                  />
                }
              </div>
            </Row>

          </Column>
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


