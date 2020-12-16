
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'


type Props = {
  value: number
  showValue?: boolean
}

const ProgressBar = (props: Props) => {
  const {showValue} = props

  const [value, setValue] = useState(props.value)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <Root>
      <Progress>
        <Bar width={value} />
      </Progress>

      {showValue &&
        <Value>{value}%</Value>
      }
    </Root>
  )
}

const Root = styled.div`
  height: 15px;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
`

const Progress = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  margin-right: 5px;
`

const Bar = styled.div`
  height: 100%;
  width: ${props => props.width ? `${props.width}%` : 0};
  background: #438ab9;
  border-radius: 2px 0 0 2px;
`

const Value = styled.div`
`


export default ProgressBar

