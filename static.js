var static = require('node-static');
var sys = require('sys');

var fileServer = new static.Server('.', { cache: false });

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    fileServer.serve(request, response, function (e, res) {
        if (e && (e.status === 404)) { // If the file wasn't found
            fileServer.serveFile('/index.html', 200, {}, request, response);
        }
    });
  }).resume();
}).listen(8080);