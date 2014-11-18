var static            = require('node-static'),
    proxyServer       = require('http-route-proxy'),
    connect           = require('connect'),
    httpProxy         = require('http-proxy'),
    transformerProxy  = require('transformer-proxy'),
    http              = require('http');

//
// Create a node-static server to serve the current directory
//
var file = new static.Server('.', { cache: false, headers: {"Cache-Control": "no-cache, must-revalidate"} });

http.createServer(function (request, response) {
    file.serve(request, response, function (err, res) {
        if (err && (err.status === 404)) { // An error as occured
          console.error("> Error serving " + request.url + " - " + err.message);
          file.serveFile('/index.html', 200, {}, request, response);
        } else { // The file was served successfully
            console.log("> " + request.url + " - " + res.message);
        }
    });
}).listen(3001);

console.log("> node-static is listening on http://127.0.0.1:3000");

/**
 *   proxy configs
 */
proxyServer.proxy([
    // common config
    {
        from: 'localhost:8002',
        to: 'localhost:8001',
        req: {origin: 'localhost:8001', referer: 'localhost:8001'},
        headers: {
            res: {'access-control-allow-origin': '*', 'access-control-allow-credentials': true}
        }

    }
]);

//
// The transforming function
//

var transformerFunction = function(data, req) {
  return "/*theseus instrument: false */\n" + data;
//  return data;
};


//
// A proxy as a basic connect app
//

var proxiedPort = 3001;
var proxyPort = 3000;

var app = connect();
var proxy = httpProxy.createProxyServer({target: 'http://localhost:' + proxiedPort});

app.use(transformerProxy(transformerFunction, { match : /^\/js\/libs\/(.*)(\.js)$/}));

app.use(function(req, res) {
  proxy.web(req, res);
});

http.createServer(app).listen(proxyPort);