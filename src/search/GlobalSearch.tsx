import React from 'react'
import {useLocation} from 'react-router-dom'
import styled from 'styled-components'

const GlobalSearch = (props) => {
  const params = useLocation()

  return (
    <Root>
      <h4>Global search result view</h4>
      Query string was: {params.search}
    </Root>
  )
}


const Root = styled.div`
  margin-top: 50px;
  background: #fff;
  height: 100%;
  padding: 20px
`

export default GlobalSearch
