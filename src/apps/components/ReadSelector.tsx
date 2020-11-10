/* eslint-disable react/display-name */
/**
 * Read Selector
 *
 * Todo:
 *  - provide onAdd/onRemove methods?
 *
 * example SRR ids: SRR5121082, ERR3827346, SRX981334
 */

import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import { parsePath } from '../../utils/paths'
import {validateSRR} from '../../api/ncbi-eutils'
import ObjectSelector from './object-selector/ObjectSelector'
import SelectedTable from './SelectedTable'
import TextInput from './TextInput'
import AddButton from '../common/AddButton'
import ArrowIcon from '@material-ui/icons/ArrowForwardRounded'
import Progress from '@material-ui/core/CircularProgress'


import Tooltip from '@material-ui/core/Tooltip'
import HelpIcon from '@material-ui/icons/HelpOutlineRounded'
import FormHelperText from '@material-ui/core/FormHelperText'



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
  button: 'infoButton'
}, {
  button: 'removeButton'
}]

// todo(nc): define reads
type Props = {
  onChange: (object) => void
  advancedOptions?: boolean
  reads?: object[]
}


export default function ReadSelector(props: Props) {
  const { onChange, advancedOptions} = props

  // currently selected path (for single reads)
  const [path, setPath] = useState(null)

  // currently selected paths (for single paired reads)
  const [path1, setPath1] = useState(null)
  const [path2, setPath2] = useState(null)

  // current SRA ID input
  const [sraID, setSraID] = useState('')

  // list of selected reads
  const [reads, setReads] = useState(props.reads)

  const [advOpen, setAdvOpen] = useState(false)

  const [interleaved, setInterleaved] = useState('false')
  const [read_orientation_outward, setMatePaired] = useState('false')
  const [platform, setPlatform] = useState('infer')

  const [validatingSRA, setValidatingSRA] = useState(false)
  const [sraMsg, setSRAMsg] = useState(null)
  const [sraError, setSRAError] = useState(null)


  useEffect(() => {
    setReads(props.reads)
  }, [props.reads])

  // two way binding on "reads"
  useEffect(() => {
    onChange(reads)
  }, [reads])


  function onAdd(type) {
    let row
    if (type == 'single') {
      row = {
        type: 'single_end_libs',
        label: parsePath(path).name,
        value: {
          read: path,
          platform,
          interleaved,
          read_orientation_outward
        }
      }
    } else if (type == 'paired') {
      row = {
        type: 'paired_end_libs',
        label: parsePath(path1).name+ ', ' + parsePath(path2).name,
        value: {
          read1: path1,
          read2: path2,
          platform,
          interleaved,
          read_orientation_outward
        }
      }
    }

    // add reads
    setReads(prev => ([...prev, row]))
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

      const status = err.response.status
      if (status >= 400 && status < 500) {
        setSRAError(`Your SRA ID ${sraID} is not valid`)
        return
      }

      setSRAMsg(`Note: we could not validate your SRA ID, but it was still added`)
    }

    const row = {
      type: 'srr_ids',
      label: sraID,
      value: sraID
    }

    setReads(prev => ([...prev, row]))
    setValidatingSRA(false)
    setSraID('')
  }


  const onRemove = ({index}) => {
    setReads(prev => prev.filter((_, i) => i != index))
  }


  return (
    <Root>
      <Inputs>

        <Row>
          <Column>
            <Title>
              Paired Read Library
            </Title>
            <Row>
              <ObjectSelector
                // noLabel
                value={path1}
                onChange={val => setPath1(val)}
                type="reads"
                dialogTitle="Select read file"
                placeholder="Read file 1"
              />
            </Row>
            <Row>
              <ObjectSelector
                // noLabel
                value={path2}
                onChange={val => setPath2(val)}
                type="reads"
                dialogTitle="Select read file 2"
                placeholder="Read file 2"
              />
            </Row>
            {path1 && path2 && path1 == path2 &&
              <FormHelperText error>
                Paired-end read files can not be the same
              </FormHelperText>
            }
          </Column>

          {path1 && path2 && path1 !== path2 &&
            <div className="align-self-center" >
              <AddButton
                onClick={() => onAdd('paired')}
                endIcon={<ArrowIcon />}
              />
            </div>
          }
        </Row>

        <Row>
          <Column>
            <Title>
              Single Read Library
            </Title>
            <Row>
              <ObjectSelector
                // noLabel
                value={path}
                onChange={val => setPath(val)}
                type="reads"
                dialogTitle="Select (single) read file"
                placeholder="Read file"
              />

              {path &&
                <div className="align-self-center" >
                  <AddButton onClick={() => onAdd('single')}
                    endIcon={<ArrowIcon />}
                  />
                </div>
              }
            </Row>
          </Column>
        </Row>

        <Row>
          <Column>
            <Title>
              SRA run accession
            </Title>

            <Row>
              <TextInput
                placeholder="SRR"
                value={sraID}
                onChange={handleSRAChange}
                noLabel
                error={!!sraError}
                helperText={sraMsg || sraError}
                style={{marginRight: 10}}
              />

              {sraID &&
                <div className="align-self-center">
                  {validatingSRA ?
                    <Progress size="30" /> :
                    <AddButton
                      onClick={() => onAddSRA()}
                      endIcon={<ArrowIcon />}
                    />
                  }
                </div>
              }
            </Row>

          </Column>
        </Row>

      </Inputs>

      <TableContainer>
        <SelectedTable
          columns={columns}
          rows={reads}
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
`

const Title = styled.div`
  margin: 0 0 0px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
  font-size: .85em;
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


