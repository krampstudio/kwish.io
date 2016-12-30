import restify from 'restify';

import klistService from './service/klist.js';

const server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.queryParser({
    mapParams: false
}));
server.use(restify.bodyParser({
    mapParams: false
}));

server.get('/klist/:name', (req, res, next) => {
    if(req.params.name){
        return klistService()
            .getOne(req.params.name)
            .then( data => {
                res.send(200, data);
                next();
            })
            .catch( next );
    }
    return next();
});

server.put('/klist/:name', (req, res, next) => {
    if(req.params.name){
        return klistService()
            .add(req.params.name)
            .then( data => {
                res.send(200, data);
                next();
            })
            .catch( next );
    }
    return next();
});


server.get(/.*/, restify.serveStatic({
    directory: 'public',
    default: 'index.html'
}));

server.on('InternalServer', function (req, res, err, cb) {
    err.body = 'Whoops';
    return cb();
});

server.listen(8180);

