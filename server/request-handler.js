/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "Content-Type": "application/json",
  "access-control-max-age": 10
};

var results = [];
var messages = {
  results: results
};

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var processRequest = function(statusCode, headers) {
    statusCode = statusCode || 200;
    response.writeHead(statusCode, headers);
  };

  if (request.method === 'GET') {
//    if ( request.url.slice(0, 19) === "/classes/chatterbox") {
    if (request.url.indexOf("/classes") >= 0) {
      processRequest(200, defaultCorsHeaders);
      response.end(JSON.stringify(messages));      
    } else { 
      processRequest(404, defaultCorsHeaders);
      response.end(JSON.stringify(messages));
    }
  } else if (request.method === 'POST') {
    var req = request;
    var res = response;
    console.log("[201] " + req.method + " to " + req.url);
      
    req.on('data', function(chunk) {
      console.log("Received body data:");
      console.log(chunk.toString());
      var message = JSON.parse(chunk.toString());
      messages.results.push(message);
    });
    
    req.on('end', function() {
      res.writeHead(201, defaultCorsHeaders);
      res.end(JSON.stringify(messages));
    });
  } else if (request.method === 'OPTIONS') {
    processRequest(200, defaultCorsHeaders);
    response.end(JSON.stringify(messages));
  }

};

exports.requestHandler = requestHandler;

// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

// Do some basic logging.
//
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.
