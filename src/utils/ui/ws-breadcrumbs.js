
import React from 'react';
import { Link, useParams} from "react-router-dom";

/**
 * Workspace specific breadcrumbs.
 */
export default function BreadCrumbs() {
  const {path} = useParams();

  const parts = path.split('/');
  const topLevel = parts.shift();
  const currentLevel = parts.length - 1;  // subtract 1 for leading "/"

  console.log('topLevel', topLevel)
  console.log('parts', parts)

  return (
    <div>
      {'/ '}
      <Link to={`/files/${topLevel}`}>{topLevel.split('@')[0]}</Link>
      {' / '}
      {
        parts.map((name, i) => {
          const userPath = parts.slice(0, i+1).join('/')
          const path = `/files/${topLevel}/${userPath}`;


          return (
            <span key={i}>
              {i == currentLevel ? name : <Link to={path}>{name}</Link>}
              {' / '}
            </span>
          )
        })
      }
    </div>
  )
}