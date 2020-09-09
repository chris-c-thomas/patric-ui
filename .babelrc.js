const plugins = [
  [
    'babel-plugin-import',
    {
      'libraryName': '@material-ui/core',
      'libraryDirectory': 'esm',
      'camel2DashComponentName': false
    },
    'core'
  ],
  [
    'babel-plugin-import',
    {
      'libraryName': '@material-ui/lab',
      'libraryDirectory': 'esm',
      'camel2DashComponentName': false
    },
    'lab'
  ],
  'babel-plugin-styled-components'
];

module.exports = {plugins};