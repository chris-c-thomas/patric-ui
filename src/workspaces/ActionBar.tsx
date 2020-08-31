
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Options from './Options'
import Actions from './Actions'

import {WSObject} from '../api/ws-api'


type Props = {
  path: string;
  selected: WSObject[];
  onClearActions: () => void;
  onUpdateList: () => void;
}

/**
 * Workspace-specific ActionBar / breadcrumbs.
 */
export default function ActionBar(props: Props) {
  const {path, onClearActions, onUpdateList} = props

  const [currentPath, setCurrentPath] = useState(path)
  const [parts, setParts] = useState([])
  const [topLevel, setTopLevel] = useState('/')
  const [currentLevel, setCurrentLevel] = useState(null)

  const [selected, setSelected] = useState(props.selected)

  useEffect(() => {
    const parts = path.split('/')
    parts.shift()
    const top = decodeURIComponent(parts[0])

    setParts(parts)
    setTopLevel(top)
    setCurrentLevel(parts.length - 1)  // subtract 1 for leading "/"
    setCurrentPath(path)
  }, [path])


  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])


  return (
    <Root className="row align-items-center space-between">
      {selected && selected.length != 0 &&
        <Actions
          path={currentPath}
          selected={selected}
          onClear={onClearActions}
          onUpdateList={onUpdateList}
        />
      }

      {(!selected || selected.length == 0) &&
        <Crumbs>
          {' / '}
          <Link to={`/files/${topLevel}`}>{topLevel.split('@')[0]}</Link>
          {' / '}
          {
            parts.slice(1).map((name, i) => {
              const userPath = parts.slice(0, i).join('/')
              const path = `/files/${topLevel}/${userPath}`

              return (
                <span key={i}>
                  {i == currentLevel - 1 ? name : <Link to={path}>{name}</Link>}
                  {' / '}
                </span>
              )
            })
          }
        </Crumbs>
      }

      {(!selected || selected.length == 0) &&
        <Opts>
          <Options
            path={currentPath}
            onUpdateList={onUpdateList}
          />
        </Opts>
      }
    </Root>
  )
}


const Root = styled.div`
  /* styling for all children buttons */
  button {
    margin-right: 10px;
  }
`


const Crumbs = styled.div`

`

const Opts = styled.div`

`