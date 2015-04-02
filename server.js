var http = require("http"),
    url  = require("url");

function start(route, handle){
    function onRequest(req,res){
        route(handle, url.parse(req.url).pathname, res, req);
    }
    http.createServer(onRequest).listen(8124);
}
exports.start = start;
