import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { AxiosError } from 'axios'

import { Row, Column } from '../common/FormLayout'

import GenomeSelector from './GenomeSelector'
import ObjectSelector from './object-selector/ObjectSelector'
import AddButton from '../common/AddButton'
import AddIcon from '@material-ui/icons/Add'

import SelectedTable from './SelectedTable'

import ErrorMsg from '../../ErrorMsg'

import {listData} from '../../api/data-api'
import {getObject} from '../../api/ws-api'



type Genome = {
  genome_name: string
  genome_id: string
}

type DispatchTypes =
  {type: 'ADD_GENOME', val: Genome} |
  {type: 'ADD_GENOME_GROUP', val: Genome[]} |
  {type: 'REMOVE_GENOME', val: number}


type Props = {
  genomeIDs?: string[]
  disableGenomeGroup?: boolean
  dispatch: (DispatchTypes) => void
}

const GenomeTableSelector = (props: Props) => {
  const {
    disableGenomeGroup,
    dispatch
  } = props

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<AxiosError>(null)

  const [genome, setGenome] = useState<Genome>(null)
  const [genomeGroup, setGenomeGroup] = useState<string>(null)

  // rows for selectedTable component
  const [rows, setRows] = useState<Genome[]>([])


  // given genome ids, get genomes_name's
  const getGenomes = async (ids: string[]) => {
    if (!ids.length) return []

    setLoading(true)

    try {
      const res = await listData({
        core: 'genome',
        eq: {genome_id: ids},
        select: ['genome_name', 'genome_id'],
        limit: 20000
      })

      let genomes = res.data.response.docs

      // keep original order
      genomes = ids.map(id => {
        return {
          genome_id: id,
          genome_name: genomes.filter(obj => obj.genome_id == id)[0].genome_name
        }
      })

      setLoading(false)
      return genomes
    } catch(err) {
      setError(err)
      setLoading(false)
    }
  }


  // listen for new genome ids, fetch genomes_names and update rows
  useEffect(() => {
    (async () => {
      const ids = props.genomeIDs
      const genomes = await getGenomes(ids)
      setRows(genomes)
    })()
  }, [props.genomeIDs])



  // when adding genome group, get genome ids and dispatch them
  const handleAddGenomeGroup = async () => {
    setLoading(true)
    setError(null)

    try {
      const {data} = await getObject(genomeGroup)
      const ids = data['id_list'].genome_id

      dispatch({type: 'ADD_GENOME_GROUP', val: ids})
    } catch(err) {
      setError(err)
    }
  }

  return (
    <Root>
      <Column padRows>

        <Row>
          <GenomeSelector
            onChange={obj => setGenome(obj)}
          />

          <AddButton
            onClick={() => dispatch({type: 'ADD_GENOME', val: genome.genome_id})}
            disabled={!genome || loading}
            endIcon={null}
            startIcon={<AddIcon />}
            color="primary"
            style={{marginLeft: 52}}
          />
        </Row>

        {!disableGenomeGroup &&
          <Row>
            <ObjectSelector
              label="And/or Select Genome Group(s)"
              type="genome_group"
              dialogTitle="Select Genome Group"
              value={genomeGroup}
              onChange={path => setGenomeGroup(path)}
            />

            <AddButton
              onClick={handleAddGenomeGroup}
              disabled={!genomeGroup || loading}
              endIcon={null}
              startIcon={<AddIcon />}
              color="primary"
              style={{marginLeft: 10}}
            />
          </Row>
        }

        {error && <ErrorMsg error={error} />}

        <h4 className="flex space-between">
          <div>
            Selected Genomes
            {rows.length > 0 &&
              <span className="muted"> ({rows.length} {rows.length > 1 ? 'genomes' : 'genomes'})</span>
            }
          </div>
          <span>
            {loading && !error && 'loading...'}
          </span>
        </h4>
        <SelectedTable
          columns={[
            {id: 'genome_name', label: 'Genome Name'},
            {id: 'genome_id', label: 'Genome ID'},
            {button: 'removeButton'}
          ]}
          rows={rows}
          onRemove={({index}) => dispatch({type: 'REMOVE_GENOME', val: index})}
          emptyNotice="No genomes selected"
        />
        <br/>
      </Column>
    </Root>
  )
}

const Root = styled.div`

`

export default GenomeTableSelector
