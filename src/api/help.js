import axios from 'axios';

const githubDocs = 'https://raw.githubusercontent.com/PATRIC3/p3_docs/master/docroot/'

export function fetchOverview(url) {
  const path = url.split('user_guides/')[1];
  url = `${githubDocs}user_guides/${path.replace('.html', '.md')}`;

  return axios.get(url)
    .then(res => {
      const text = res.data;
      const start = text.indexOf('##');
      const end = text.slice(start + 2).search(/\n## /);
      const overview = text.slice(start, end + start + 1);
      return overview;
    });
}