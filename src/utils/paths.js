

// pathToObj: convenience helper that takes a path and
//  returns an object
export function parsePath(path) {
  return {
    name: path.slice(path.lastIndexOf('/') + 1),
    path: path,
    label: pathToLabel(path)
  };
}


/**
 * pathToOptionObj: helper used for dropdown options
 */
export function pathToOptionObj(path) {
  if (!path)
    return null

  return {
    label: pathToLabel(path),
    value: path
  };
}


function pathToLabel(path) {
  const parts = path.split('/');

  // remove user domain for label
  parts[1] = parts[1].split('@')[0];
  return '/' + parts.slice(1).join('/');
}