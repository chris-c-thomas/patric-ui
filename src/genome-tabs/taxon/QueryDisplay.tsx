import React from 'react'
import styled from 'styled-components'

type Props = {
  filterState: object
}

const QueryDisplay = (props: Props) => {
  const {filterState} = props

  console.log('filterState', filterState)
  return (
    <Root>
      Blah blah
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  height: 25px;
  border-bottom: 2px solid #f2f2f2;
`

export default QueryDisplay
