/**
 * configuration of API endpoints.
 *
 * NOTE: No trailing slashes should be used in urls!
 */

export default {
  timeout: 5000,  // use timeout for workspaces and jobs

  dataAPI: 'https://patricbrc.org/api', //'https://alpha.bv-brc.org/api', //
  appServiceAPI: 'https://p3.theseed.org/services/app_service',
  wsAPI: 'https://p3.theseed.org/services/Workspace',
  authAPI: 'https://user.patricbrc.org/authenticate',
  docsURL: 'https://docs.patricbrc.org',

  p3URL: 'https://alpha.bv-brc.org', // 'https://patricbrc.org' // used for old website links
}
