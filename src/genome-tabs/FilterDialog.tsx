import React from 'react'
import styled from 'styled-components'

import Dialog from '../dialogs/BasicDialog'

const FilterDialog = (props) => {


  return (
    <Root>
      <Dialog {...props} />
    </Root>
  )
}

const Root = styled.div`

`

export default FilterDialog
