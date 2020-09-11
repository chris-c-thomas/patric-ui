import React from 'react'
import {useLocation} from 'react-router-dom'
import styled from 'styled-components'

const GlobalSearch = (props) => {
  const params = useLocation()
  console.log('params', params)

  return (
    <Root>
      this is a search result
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
