import authHeader from './authorization-header';

function authorizedFetch(url, opts) {
  return fetch(url, Object.assign(opts || {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authHeader //TODO set this from real user
    }
  })).then(function(res) {
    return res.json();
  });
}
export default authorizedFetch;