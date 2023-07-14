export default function logAppen(params) {
  var url = '../common/json/corporateDownloader.json?';
  for (var key in params) {
    url += "&" + key + "=" + params[key]
  }
  fetch(url, {
      method: 'GET', // or 'PUT'
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    // .then(res => res.json())
    .catch(error => console.error('Error:', error))
    // .then(response => console.log('Success:', response));
}
