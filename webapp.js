var server = require('./server'),
    router  = require('./router'),
    reqHandlers = require("./requestHandlers"),
    handle = {};
    //route handling
    handle['/'] = reqHandlers.start;
    handle['/start'] = reqHandlers.start;
    handle['/upload'] = reqHandlers.upload;
    handle['/show'] = reqHandlers.show;

    server.start(router.route, handle);