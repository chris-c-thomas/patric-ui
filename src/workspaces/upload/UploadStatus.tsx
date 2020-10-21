import React, { useContext } from 'react'
import styled from 'styled-components'

import { UploadStatusContext } from './UploadStatusContext'


const UploadStatus = () => {
  const [state] = useContext(UploadStatusContext)

  return (
    <Root>
      {Object.keys(state.active)
        .map(key => {
          const {name, progress} = state.active[key]

          return (
            <>
              <div>{name}</div>
              <div>{progress}%</div>
            </>
          )
        })
      }
    </Root>
  )
}

const Root = styled.div`

`

export default UploadStatus
