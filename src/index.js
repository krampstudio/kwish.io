import restify from 'restify';

const server = restify.createServer();

server.get(/.*/, restify.serveStatic({
    directory: 'public',
    default: 'index.html'
}));

server.listen(8180, (...args) => console.log('Server started', args));


