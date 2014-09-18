var static = require('node-static');

//
// Create a node-static server to serve the current directory
//
var file = new static.Server('.', { cache: false, headers: {"Cache-Control": "no-cache, must-revalidate"} });

require('http').createServer(function (request, response) {
    file.serve(request, response, function (err, res) {
        if (err && (err.status === 404)) { // An error as occured
          console.error("> Error serving " + request.url + " - " + err.message);
          file.serveFile('/index.html', 200, {}, request, response);
        } else { // The file was served successfully
            console.log("> " + request.url + " - " + res.message);
        }
    });
}).listen(8080);

console.log("> node-static is listening on http://127.0.0.1:8080");