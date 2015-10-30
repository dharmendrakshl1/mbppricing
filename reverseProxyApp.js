var http = require('http'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({}),
    url = require('url');

http.createServer(function(req, res) {
    var hostname = req.headers.host.split(":")[0];
    var pathname = url.parse(req.url).pathname;

   // console.log(hostname);
    console.log(pathname);

    switch(pathname)
    {
        case '/corpdb':
            proxy.web(req, res, { target: 'http://localhost:9001' });
            break;
        case '/home':
            proxy.web(req, res, { target: 'http://localhost:9002' });
            break;
        default:
            proxy.web(req, res, { target: 'http://localhost:9003' });
    }
}).listen(9000, function() {
    console.log('proxy listening on port 9000');
});

// We simulate the 3 target applications
http.createServer(function(req, res) {
    res.end("Request received on 9001");
}).listen(9001);

http.createServer(function(req, res) {
    res.end("Request received on 9002");
}).listen(9002);

http.createServer(function(req, res) {
    res.end("Request received on 9003");
}).listen(9003);