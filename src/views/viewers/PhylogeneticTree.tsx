import React, {useRef, useState, useEffect}from 'react'
import { useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import Phylocanvas from 'phylocanvas'

import {getPhyloData} from '../../api/data-api'

import ErrorMsg from '../../ErrorMsg'

import {list, getObject} from '../../api/ws-api'


const config = {}

const getJobResultDir = (path) => {
  const parts = path.split('/')
  const name = parts.pop()
  return `${parts.join('/')}/.${name}`
}


const loadTree = (domRef, newick) => {
  const tree = Phylocanvas.createTree(domRef.current, config)
  tree.load(newick, () => console.log('tree loaded'))
  tree.setTreeType('rectangular')
}



export default function Phylogeny() {
  const ref = useRef(null)
  const {taxonID, genomeID} = useParams()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const wsTreeFolder = params.get('wsTreeFolder')


  const [notFound, setNotFound] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!taxonID && !genomeID) return

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


  useEffect(() => {
    (async () => {
      if (!wsTreeFolder) return

      try {
        const path = getJobResultDir(wsTreeFolder)
        const objs = await list({path, showHidden: true, recursive: true})
        const nwkFiles = objs.filter((obj) => obj.path.endsWith('treeWithGenomeIds.nwk'))
        const nwkPath = nwkFiles[0].path

        const data = await getObject(nwkPath)
        loadTree(ref, data.data)
      } catch(err) {
        setError(err)
      }
    })()
  }, [wsTreeFolder])



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

