
import React, {useState, useEffect, MouseEvent} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import WSOptions from './WSOptions'
import WSActions from './WSActions'

import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import Tooltip from '@material-ui/core/Tooltip'

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
  showHidden: boolean
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
    onNavigateBreadcrumbs,
    onShowDetails
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


  const showActions = () => (selected || []).length > 0

  const showOptions = () =>
    (!selected || selected.length == 0) && !['file'].includes(viewType)



  return (
    <Root className="flex align-items-center space-between">
      {(!selected || selected.length == 0) &&
        <Breadcrumbs
          path={path}
          onNavigate={onNavigateBreadcrumbs}
        />
      }

      {selected.length > 0 &&
        <FileName>
          {selected.length == 1 &&
            <>{selected[0].name}<span> is selected</span></>
          }
          {selected.length > 1 &&
            <span>{selected.length} items are selected</span>
          }
        </FileName>
      }

      <div className="flex">
        {showOptions() &&
          <WSOptions
            path={path}
            {...props}
          />
        }

        {showActions() &&
          <WSActions
            path={path}
            {...props}
          />
        }

        {viewType != 'objectSelector' &&
          <Tooltip title="show details">
            <IconButton onClick={onShowDetails} size="small" color="primary" disableRipple>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        }
      </div>
    </Root>
  )
}


const Root = styled.div`
  /* styling for all children buttons */
  .MuiButton-root { margin-right: 10px; }
  .MuiIconButton-root { margin-right: 10px; padding: 0; }
`

const FileName = styled.div`
  font-weight: bold;
  font-size: 1.1em;

  span {
    font-size: .85em;
    font-weight: normal;
  }
`



