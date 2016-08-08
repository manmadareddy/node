const http = require('http');
const url = require('url');
const qs = require('querystring');
http.createServer(function(req,res){
    if (req.method === 'POST') {
        var postbody ='',
            postfields;
        req.on('data', function(data){
            postbody += data;
        });

        req.on('end', function(data){
            postfields = qs.parse(postbody);
            res.write(JSON.stringify(postfields,null,4));
        });
    } else {
        var urlparts = url.parse(req.url, true);
        res.write(JSON.stringify(urlparts.query,null,4));
    }
    res.statusCode = 200;
    res.end('');
}).listen(3000,'127.0.0.1',function(){
   console.log('server is running http://127.0.0.1:3000');
});
