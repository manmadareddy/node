//var exec = require('child_process').exec;
var querystring = require("querystring"),
    formidable = require("formidable"),
    fs = require("fs");
function start(response, request){
    console.log("in start");
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+ 'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" method="post" enctype="multipart/form-data">'+
        '<input type="text" name="title"></input>'+
        '<input type="file" name="upload"></input>'+
        '<input type="submit" value="Submit text" />'+ '</form>'+
        '</body>'+
        '</html>';
    //exec("ls -lah", function (err, stdout, stderr) {
        response.writeHead("200",{"Content-Type":"text/html"});
        response.write(body);
        response.end();
    //});
}

function upload(response, request){
    if (request.url == '/upload' && request.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.parse(request, function(error, fields, files) {
            fs.rename(files.upload.path, "/tmp/temp.png", function(error) {
                if (error) {
                    fs.unlink("/tmp/test.png");
                    fs.rename(files.upload.path, "/tmp/temp.png");
                }
            });
            response.writeHead(200, {'content-type': 'text/html'});
            response.write('received upload: <img src="/show">');
            response.end();
        });
    }else{
        response.writeHead("200",{"Content-Type":"text/plain"});
        response.write("Please upload a file");
        response.end();
    }
}

function show(response, request){
    fs.readFile("/tmp/temp.png", "binary", function(error, file){
        if(error){
            response.writeHead("500",{"Content-Type":"text/plain"});
            response.write("Failed to read");
            response.end();
        }else{
            response.writeHead("200",{"Content-Type":"image/png"});
            response.write(file,"binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;