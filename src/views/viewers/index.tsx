import React from 'react'
import { useParams} from 'react-router-dom'
import styled from 'styled-components'


import PhylogeneticTree from './PhylogeneticTree'
import NotFound404 from '../../404'



// todo(nc): replace with dynamic imports (at runtime)
const getViewer = (view) => {
  let component
  if (view == 'PhylogeneticTree')
    component = <PhylogeneticTree />
  else
    component = <NotFound404 />


  return component
}



export default function ViewRouter() {
  const {view} = useParams()


  return (
    <Root>
      <Content>
        {getViewer(view)}
      </Content>
    </Root>
  )
}

const Root = styled.div`
  background: #fff;
`
const Content = styled.div`
  border-top: 1px solid #e9e9e9;
  margin-top: -1px;
  background: #fff;
`