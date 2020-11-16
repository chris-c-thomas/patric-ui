
import React, {useState, useEffect, MouseEvent} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import WSOptions from './WSOptions'
import WSActions from './WSActions'

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
  onShowHidden: () => void
  onShowDetails: () => void
  viewType?: 'jobResult' | 'objectSelector' | 'file'
  onNavigateBreadcrumbs?: (evt: MouseEvent<Element>, string) => void
}


/**
 * Workspace-specific ActionBar / breadcrumbs.
 */
export default function ActionBar(props: Props) {
  const {
    onNavigateBreadcrumbs
  } = props

  const [path, setPath] = useState(props.path)
  const [selected, setSelected] = useState(props.selected)
  const [viewType, setViewType] = useState(props.viewType)


  useEffect(() => {
    setPath(props.path)
  }, [props.path])


  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])

  useEffect(() => {
    setViewType(props.viewType)
  }, [props.viewType])


  const showOptions = () =>
    (!selected || selected.length == 0) && !['file'].includes(viewType)



  return (
    <Root className="row align-items-center space-between">
      {selected && selected.length != 0 &&
        <WSActions
          path={path}
          {...props}
        />
      }

      {(!selected || selected.length == 0) &&
        <Breadcrumbs
          path={path}
          onNavigate={onNavigateBreadcrumbs}
        />
      }

      {showOptions() &&
        <Opts>
          <WSOptions
            path={path}
            {...props}
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