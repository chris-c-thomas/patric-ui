
import React, { useEffect, useState } from 'react'
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
        <Bar style={{width: value ? `${value}%` : 0}}/>
      </Progress>

      {showValue &&
        <div>{value}%</div>
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
  background: #438ab9;
  border-radius: 2px 0 0 2px;
`


export default ProgressBar

