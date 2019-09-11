

export function pathToOptionObj(path) {
  const parts = path.split('/');
  return {
    label: '/' + parts.slice(2).join('/'),
    value: path
  };
}