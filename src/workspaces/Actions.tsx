
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

type WSObject = {
  name: string;
}

type Props = {
  selected: WSObject | WSObject[];
  currentPath: string;
  currentName: string;
}

export default function Actions(props: Props) {
  const {selected} = props

  return (
    <>
      <FileName>
        {selected.length == 1 ?
          selected[0].name :
          `${selected.length} items`
        }
      </FileName>
    </>
  )
}

const FileName = styled.div`
  font-weight: bold;
`