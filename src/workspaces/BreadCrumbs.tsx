
import React, {useState, useEffect} from 'react'

import { Link } from 'react-router-dom'
import Actions from './Actions'


/**
 * Workspace-specific breadcrumbs.
 */
export default function BreadCrumbs(props) {
  const {path} = props

  const [filePath, setFilePath] = useState(path)
  const [parts, setParts] = useState([])
  const [topLevel, setTopLevel] = useState('/')
  const [currentLevel, setCurrentLevel] = useState(null)
  const [fileName, setFileName] = useState(null)

  const [selected, setSelected] = useState(props.selected)

  useEffect(() => {
    const parts = path.split('/')
    parts.shift()
    const top = decodeURIComponent(parts[0])

    setParts(parts)
    setTopLevel(top)
    setCurrentLevel(parts.length - 1)  // subtract 1 for leading "/"
    setFilePath(path)
    setFileName(parts[parts.length - 1])
  }, [path])


  useEffect(() => {
    setSelected(props.selected)
  }, [props.selected])


  return (
    <div>
      {selected &&
        <Actions
          currentPath={filePath}
          currentName={fileName}
          selected={selected}
        />
      }

      {!selected &&
        <>
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
        </>
      }
      <Options>

      </Options>
    </div>
  )
}

const Options = styled.div`

`