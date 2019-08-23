
import React from 'react';


/**
 * Basic breadcrumbs.
 * Should consider using material-ui for this?
 *
 * @param {*} props
 */
export default function BreadCrumbs(props) {
  const {path} = props;

  const parts = path.split('/');
  const currentLevel = parts.length - 1;  // subtract 1 for leading "/"


  function onClick(level) {
    const path = parts.slice(0, level + 1).join('/');
    props.onNavigate(path);
  }

  return (
    <div>
      {
        parts.map((dirName, i) => {
          return (
            <span key={i}>
              {i == currentLevel ? dirName : <a onClick={() => onClick(i)}>{dirName}</a>}
              {' / '}
            </span>
          )
        })
      }
    </div>
  )
}