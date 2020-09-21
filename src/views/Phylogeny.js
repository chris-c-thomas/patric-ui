import React, {useRef, useState, useEffect}from 'react'
import { useParams} from 'react-router-dom'
import styled from 'styled-components'
import Phylocanvas from 'phylocanvas';

import {getPhyloData} from '../api/data-api'

import ErrorMsg from '../ErrorMsg'


const config = {}


const loadTree = (domRef, newick) => {
  const tree = Phylocanvas.createTree(domRef.current, config);
  tree.load(newick, () => console.log('tree loaded'));
  tree.setTreeType('rectangular');
}


export default function Phylogeny() {
  const ref = useRef(null)
  const {taxonID, genomeID} = useParams()

  const [notFound, setNotFound] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPhyloData({taxonID, genomeID}).then(res => {
      loadTree(ref, res.tree)
    }).catch(err => {
      if (err.response.status == 404) {
        setNotFound(true)
        return
      }

      setError(err)
    })
  }, [taxonID, genomeID])


  return (
    <Root>
      {notFound &&
        <NoneFoundNotice>There is no tree currently available</NoneFoundNotice>
      }
      {error &&
        <ErrorMsg error={error} />
      }
      <Container ref={ref}>
      </Container>
    </Root>
  )
}

const Root = styled.div`

`
const Container = styled.div`
  height: calc(100% - 170px);
`

const NoneFoundNotice = styled.div`
  margin: 10px 10px;
  display: flex;
  align-items: center;
  color: #666;

`

