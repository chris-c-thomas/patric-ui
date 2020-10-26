
import React, {useState, useEffect, MouseEvent} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Options from './WSOptions'
import Actions from './WSActions'

import { WSObject } from '../api/workspace.d'


const Breadcrumbs = (props) => {
  const {topLevel, parts, currentLevel, onNavigate} = props
  return (
    <div>
      {' / '}
      <Link
        to={`/files/${topLevel}`}
        onClick={(evt) => onNavigate(evt, `/${topLevel}`)}>
        {topLevel.split('@')[0]}
      </Link>
      {' / '}
      {
        parts.slice(1).map((name, i) => {
          const userPath = parts.slice(1, i-1).join('/')
          const path = `/files/${topLevel}/${userPath}`

          return (
            <span key={i}>
              {i == currentLevel - 1 ?
                name :
                <Link
                  to={path}
                  onClick={(evt) => onNavigate(evt, `/${topLevel}/${userPath}`)}
                >
                  {name}
                </Link>
              }
              {' / '}
            </span>
          )
        })
      }
    </div>
  )
}


type Props = {
  path: string;
  selected: WSObject[]
  onUpdateList: () => void
  isJobResult?: boolean
  isObjectSelector?: boolean
  onNavigateBreadcrumbs?: (evt: MouseEvent<Element>, string) => void
}


/**
 * Workspace-specific ActionBar / breadcrumbs.
 */
export default function ActionBar(props: Props) {
  const {
    path,
    isJobResult,
    isObjectSelector,
    onUpdateList,
    onNavigateBreadcrumbs
  } = props


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
          onUpdateList={onUpdateList}
          isObjectSelector={isObjectSelector}
        />
      }

      {(!selected || selected.length == 0) &&
        <Breadcrumbs
          topLevel={topLevel}
          currentLevel={currentLevel}
          parts={parts}
          onNavigate={onNavigateBreadcrumbs}
        />
      }

      {(!selected || selected.length == 0) && !isJobResult &&
        <Opts>
          <Options
            path={currentPath}
            onUpdateList={onUpdateList}
            isObjectSelector
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

const Opts = styled.div`

`