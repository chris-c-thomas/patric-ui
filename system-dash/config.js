export default {
  auth: {
    label: 'Auth',
    logColumn: 'Auth',
    description: 'User registration and login',
    url: 'https://user.patricbrc.org/'
  },
  dataAPI: {
    label: 'Data API',
    logColumn: 'Data API',
    description: 'All services; Search; PATRIC public and private data',
    url: 'https://patricbrc.org/api/genome/?http_accept=application/solr+json'
  },
  ws: {
    label: 'Workspace',
    logColumn: 'Workspace',
    description: 'All services; public and private Workspace data (files)',
    url: 'https://p3.theseed.org/services/Workspace/ping'
  },
  shock: {
    label: 'Shock',
    description: 'All services; storage and retrieval of Workspace data (files)',
    url: 'https://p3.theseed.org/services/shock_api/node'
  },
  appService: {
    label: 'App Service',
    description: 'PATRIC job submissions (Services)',
    url: 'https://p3.theseed.org/services/app_service/ping'
  },
  minHash: {
    label: 'Min Hash',
    description: 'Similar genome finder',
    url: 'https://p3.theseed.org/services/minhash_service/ping'
  },
  homology: {
    label: 'Homology Service',
    description: 'BLAST queries',
    url: 'https://p3.theseed.org/services/homology_service/ping'
  }
}

export const timeout = {
  liveStatus: 200000, // timeout for "live status" component
}
