//var exec = require('child_process').exec;
var querystring = require("querystring"),
    //formidable = require("formidable"),
    db = require('./mongodb').dbFunctions;
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

function todo(response, request){
    db.connect(function(collection){
        db.getAll(collection, function(items){
            var body = '', i=0;
            for(var i in items){
                body += '<li>'+ items[i]['task'] +' on ' + items[i]['due'] +'</li>';
            }
            response.writeHead("200",{"Content-Type":"text/html"});
            response.write('<ul>'+ body + '</ul><form method="post" action="/addrecord"><input type="text" name="task"><input type="submit" value="Add Record"></form>');
            response.end();
        });
    });
}

function addRecord(response, request){
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function(postChunk){
            body += postChunk;
        });

        request.on('end', function(){
            var postFields  = querystring.parse(body);
            db.connect(function (collection) {
                db.insert(collection, {task: postFields['task'], due: new Date()}, function () {
                    response.writeHead("200", {"Content-Type": "text/html"});
                    response.write('Added the record: Back to <a href="/todo">Todo List</a>');
                    response.end();
                });
            });
        });
    }
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.todo = todo;
exports.add = addRecord;