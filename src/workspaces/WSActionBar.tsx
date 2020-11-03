
import React, {useState, useEffect, MouseEvent} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Options from './WSOptions'
import Actions from './WSActions'

import { WSObject } from '../api/workspace.d'

type BreadcrumbProps = {
  path: string
  onNavigate: (evt: MouseEvent, path: string) => void
}


const Breadcrumbs = (props: BreadcrumbProps) => {
  const {path, onNavigate} = props

  const parts = path.split('/')
  parts.shift()
  const topLevel = decodeURIComponent(parts[0])
  const currentLevel = parts.length - 1


  return (
    <div>
      {' / '}
      <Link
        to={`/files/${topLevel}`}
        onClick={(evt) => onNavigate(evt, `/${topLevel}`)}>
        {topLevel.split('@')[0]}
      </Link>
      {' / '}

      {parts.slice(1).map((name, i) => {
        const userPath = parts.slice(1, 2 + i).join('/')
        const fullPath = `/${topLevel}/${userPath}`
        const path = `/files${fullPath}`

        return (
          <span key={i}>
            {i == currentLevel - 1 ?
              name :
              <>
                <Link
                  to={path}
                  onClick={(evt) => onNavigate(evt, fullPath)}
                >
                  {name}
                </Link>
                {' / '}
              </>
            }
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
  const [selected, setSelected] = useState(props.selected)


  useEffect(() => {
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
          path={path}
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