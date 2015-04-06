var mongoClient = require('mongodb').MongoClient,
    connectionUrl = 'mongodb://localhost:27017/exampleDb';

var dbFunctions = {};
dbFunctions.connect = function(callback){
    mongoClient.connect(connectionUrl, function (err, mdb) {
        callback(mdb.collection('test'));
    });
};
/*
function start() {
    var collection = '';
    mongoClient.connect(connectionUrl, function (err, mdb) {
        collection = mdb.collection('todo');
    });

    function insert(doc){
        collection.insert(doc, {w:1}, function(err, result) {
            console.log("inserted");
        });
    }

    function getAll(collection){
        collection.find().toArray(function(err, items) {
            console.log("selection");
            return items;
        });
    }
}*/

dbFunctions.insert = function(collection, doc, callback){
    collection.insert(doc, {w:1}, function(err, result) {
        callback('Inserted the record');
    });
};

dbFunctions.getAll = function(collection, callback){
    collection.find().toArray(function(err, items) {
        callback(items);
    });
};
exports.dbFunctions = dbFunctions;
