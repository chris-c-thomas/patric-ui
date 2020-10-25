import React, {useState, ReactNode} from 'react'
import styled from 'styled-components'

type Props = {
  onDrop: (files: object[]) => void
  children: ReactNode
}

const DragAndDrop = (props: Props) => {
  const {onDrop} = props

  const [isDropping, setIsDropping] = useState(false)


  const handleDragEnter = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = e => {
    e.preventDefault()
    e.stopPropagation()
    setIsDropping(false)
  }

  const handleDragOver = e => {
    e.preventDefault()
    e.stopPropagation()

    e.dataTransfer.dropEffect = 'copy'
    setIsDropping(true)
  }

  const handleDrop = e => {
    e.preventDefault()
    e.stopPropagation()

    setIsDropping(false)
    onDrop([...e.dataTransfer.files])
  }

  return (
    <Root
      onDrop={e => handleDrop(e)}
      onDragOver={e => handleDragOver(e)}
      onDragEnter={e => handleDragEnter(e)}
      onDragLeave={e => handleDragLeave(e)}
      isDropping={isDropping}
    >
      <div>
        <div>{props.children}</div>
        <div>or</div>
        <b>Drag files here</b>
      </div>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  justify-content: center;
  height: 150px;
  border-radius: 5px;
  background: ${props => props.isDropping == 1 ? `#8ad0ff` :  `#e0f3ff`};
  border: 3px ${props => props.isDropping == 1 ? `solid #008ae6` :  `dashed #008ae6`};

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > * {
      margin: 5px 0;
    }
  }
`


export default DragAndDrop