'use strict'; //Caso esqueça de ponto e virgula....boas práticas

//Require é como se importa no node modules. Tudo que não for um caminho ele vai busca na pasta "node_modules".
const app = require('../source/app');
const http = require('http');
const debug = require('debug')('nodestore:server');
const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log(`listening on port ${port}...`);

function normalizePort(value){
    const port = parseInt(value, 10);
    if(isNaN(port))
        return value;

    if(port > 0)
        return port;

    return false;
}

//Error middleware
function onError(error){
    console.log('passe');
    if(error.syscall != 'listen') throw error;
    const bind = typeof port === 'string' ? `Pipe ${port}` :  `Port ${port}`;
    switch(error.code){
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

//Listening middleware
function onListening(){
    const address = server.address();
    const bind = typeof address === 'string' ? `pipe ${address}` :`port ${address}`;
    debug(`Listening on ${bind}`);

}