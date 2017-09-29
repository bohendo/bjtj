
# Node.js

By Bo Henderson

Last updated on Sep 18 2017

## Resources
 - [Anatomy of Node's HTTP Transactions](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)
 - [Node 6 HTTP Docs](https://nodejs.org/dist/latest-v6.x/docs/api/http.html)

## Installation

TL;DR of [Official Node Installation Guide](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions): Install Node 6 on Ubuntu with these two commands:

```bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt install -y nodejs
```

## Overview

Node is a Javascript runtime environment. It interprets javascript code, keeps track of the state, and provides a basic library. At it's core, Node just runs an event loops that constantly looks for, and processes events. Other platforms spin up new processes to achieve concurrency but node's event loop lets us mimic it with a single thread.

Synchronous aka blocking operations force the event loop to stop and wait for an event to be processed before moving on. Asynchronous/non-blocking operations let the event loop start dealing the next event when the current one is waiting on something external. Asynchronous execution is more complex but provides a huge improvement in situations where we spend lots of time waiting

EventEmitter is the parent class of everything that emits events eg net.Server or fs.ReadStream objects ie everything important. Two important methods: eventEmitter.emit() to emit a named event and eventEmitter.on() to register a listener for this emitter's events.

Apart from events, streams are the other fundamental node building block. HTTP requests and file I/O are represented as streams of data which generate events when new data is available to be processed.


## Simple HTTP Server Example

```javascript
const http = require('http');

// creates an http.Server instance
const server = http.createServer();

// registers a listener for 'request' events coming from our server
// request events come with 2 parameters:
// - an http.IncomingMessage instance (request)
// - an http.ServerResponse instance (response)
server.on('request', (request, response) => {

    // register listeners for request or response errors
    request.on('error', (err) => { console.error(err); });
    response.on('error', (err) => { console.error(err); });

    // listen for 'data' and 'end' events to piece our body together
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
    });

    // compose our response
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello World');
    // Add one more piece of data and mark our response as finished
    response.end('!');

}).listen(8080);
```

## API Reference

### HTTP Server API

http.Server inherits from net.Server

http.Server is an eventEmitter with the following events

 - close: emitted once all connections have ended
 - connection: emitted when a new connection is made
 - error: emitted on error, doesn't close the connection for you like it does in net.socket
 - listening: emitted once the server's ready after calling server.listen
 - checkContinue: emitted when we receive an HTTP `Expect: 100-continue`. Default action is to send `100 Continue`.
 - checkExpectation: emitted when we receive an HTTP `Expect` header. Default action is to send `417 Expectation Failed`.
 - clientError: emitted when we receive an error from the client. Default action is to destroy the socket.
 - connect: emitted when the client requests an HTTP `CONNECT` method (used to setup proxies). Default action is to close the connection.
 - request: emitted each time we receive a request.
 - upgrade: emitted when client requests an HTTP upgrade. Default action is to close the connection.

Server methods (first 4 inherited from net.Server):

 - server.address(): returns an object like `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`
 - server.getConnections([callback[): asynchronously get the number of connections
 - server.ref(): tells the server it's **not** ok to exit if it's the only one left (this is the default behavior)
 - server.unref(): tells the server it's ok to exit if it's the only one left
 - server.listen(interface[, callback]): listen to some interface (a server or socket object or a path to a unix socket file) for new connections.
 - server.listen([port][, hostname][, backlog][, callback]): begin accepting connections from some port (default to random port) at some hostname (defaults to 0.0.0.0 aka :: aka everyone). Callback added as listener for 'listening' event.
 - server.setTimeout(n[, callback]): sets the timeout for this server's sockets to `n` milliseconds.

Server properties (first one inherited from net.Server):

 - server.maxConnections: probably defaults to no limit but you can set one by assigning to this property
 - server.listening: true if server is listening for connections else false
 - server.maxHeadersCount: number of incoming headers allowed (defaults to 1000, 0 means no limit)
 - server.timeout: number of milliseconds before any future connections timeout


### HTTP IncomingMessage API

An instance of http.IncomingMessage is created by http.Server when our server receives a request or by http.ClientRequest when our client receives a response. There are slight differences depending on where it came from and, since I'll be using node as a server, I'll cover the server-specific API in which an IncomingMessage represents a request.

http.IncomingMessage is an eventEmitter with the following events (all but the first two come from the stream.Readable interface)

 - aborted: emitted when the client aborts this message and we finish closing their socket
 - close: emitted when the underlying connection is closed
 - data: emitted when the readable stream hands off a chunk of data with that chunk being passed as an argument to any listeners
 - end: emitted when there is no more data to read from this stream
 - error: emitted when something goes wrong
 - readable: emitted when data is available to be read from this stream

Request methods:

 - request.destroy([error]): destroys the socket that received this message. Also emits an 'error' event and passes it's `error` arg to listeners if an arg is provided
 - request.setTimeout(msecs, callback): sets the underlying socket's timeout to msecs. Callback is added as listener to the `timeout` event.

Request properties:

 - request.headers: object containing clean (lowercase, no duplicate keys) header data
 - request.httpVersion: string probably containing '1.1' or '1.0'
 - request.method: string containing the HTTP verb for this request eg 'GET'
 - request.rawHeaders: array of raw header data eg `['key_1', 'value_1', 'key_2', 'value_2']`
 - request.rawTrailers: array of raw trailer data, populated at the 'end' event.
 - request.socket: the socket object associated with this request
 - request.trailers: object containing clean (lowercase, no duplicate keys) trailer data
 - request.url: string containing the request url's path & parameters (no protocol/server/port)


### HTTP Response API

http.ServerResponse is an eventEmitter with the following events (all but the first two come from the stream.Writable interface)

 - close: emitted if the connection is closed before we were able to call response.end().
 - finish: emitted when we're done pushing packets onto the network.
 - drain: If writing to this buffer was delayed (ie stream.write() returned false), this event is emitted when we're ready to write again.
 - error: emitted when something goes wrong (stream isn't automatically closed)
 - finish: emitted once stream.end() has been called and all data has been flushed to the underlying buffer.

Response methods:

 - response.addTrailers(headers): adds trailing headers at the end of our response
 - response.end([data][, encoding][, callback]): adds data to the response body and then signals to the server that we're done sending our response. Needs to be called for every response.
 - response.getHeader(key): returns some value from the header that's been queued but not sent to the client yet.
 - response.removeHeader(key): removes some key-value pair for the queued header
 - response.setHeader(key, value): adds a key-value pair to the queued header
 - response.setTimeout(msecs, callback): sets the underlying socket's timeout to msecs. Callback is added as listener to the `timeout` event.
 - response.write(chunk [, encoding][, callback]): sends a chunk (buffer or string with some encoding) of the response body
 - response.writeContinue(): sends a `HTTP/1.1 100 Continue` message.
 - response.writeHead(statusCode [, statusMessage][, headers]): sends a header with some status code. Needs to be called once pre response. Will be called to send an implicit header if you call response.write() or response.end() before calling this one.

Response properties:

 - response.finished: true if response.end() has executed otherwise false
 - response.headersSent: true if headers have been sent, false otherwise
 - response.sendDate: true if we want a Date header automatically included (we do)
 - response.statusCode: defines the status code that will be used in the implicit header if response.writeHead() is not called explicitly.
 - response.statusMessage: defines the status message that will be used in the implicit header if response.writeHead() is not called explicitly.

