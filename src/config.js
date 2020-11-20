/**
 * configuration of API endpoints.
 *
 * NOTE: No trailing slashes should be used in urls!
 */

export default {
  timeout: 20000,  // use timeout for workspaces and jobs

  dataAPI: 'https://patricbrc.org/api', //'https://alpha.bv-brc.org/api', //
  appServiceAPI: 'https://p3.theseed.org/services/app_service',
  wsAPI: 'https://p3.theseed.org/services/Workspace',
  authAPI: 'https://user.patricbrc.org/authenticate',
  docsURL: 'https://docs.patricbrc.org',

  p3URL: 'https://patricbrc.org' // 'https://alpha.bv-brc.org' // used for old website links
}
