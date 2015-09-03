
function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}

function authorizedFetch(url, opts) {
  return fetch(url, Object.assign(opts || {}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': make_base_auth('admin', 'admin') //TODO set this from real user
    }
  })).then(function(res) {
    return res.json();
  });
}
export default authorizedFetch;