

// pathToObj: convience helper that takes a path and
//  returns an object
export function pathToObj(path) {
  const parts = path.split('/'),
    name = parts.pop();

  return {
    name,
    path: parts.join('/'),
    fullPath: path
  };
}


/**
 * pathToOptionObj: helper used for dropdown options
 */
export function pathToOptionObj(path) {
  const parts = path.split('/');
  return {
    label: '/' + parts.slice(2).join('/'),
    value: path
  };
}