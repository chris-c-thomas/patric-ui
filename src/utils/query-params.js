
export const queryParams = params =>
  Object.keys(params)
    .map(key => `${key}=${encodeURI(params[key])}`)
    .join('&');
