var util = require('util')
  , WSClient = require('ws')
  , WSServer = require('ws').Server
  ;

var argv = require('optimist')
         . options("u", {alias:"url"})
         . options("p", {alias:"port"})
         . argv;

var ports = util.isArray(argv.port) ? argv.port : [argv.port];
var urls  = util.isArray(argv.url ) ? argv.url  : [argv.url ];

ports = ports.filter(function(val) {return val !== undefined;});
urls  = urls .filter(function(val) {return val !== undefined;});

ports.forEach(function(val) {
  if (typeof(val) !== "number") {
    throw new Error("port error : is not number. : [" + val + "]");
  }
});
urls.forEach(function(val) {
  if (typeof(val) !== "string") {
    throw new Error("url error : is not string. : [" + val + "]");
  }
});

if (ports.length + urls.length === 0) {
  throw new Error("nothing option error : need port and/or url.");
}

var serversides = [];
var clientsides = [];

var send = function(data, flags, from) {

  var options = {};
  if (flags.binary) {
    options.binary = true;
  }
  serversides.forEach(function(to) {
    if (from !== to) {
      to.send(data, options);
    }
  });

  var options = {mask: true};
  if (flags.binary) {
    options.binary = true;
  }
  clientsides.forEach(function(to) {
    if (from !== to) {
      to.send(data, options);
    }
  });

};

ports.forEach(function(port) {

  var server = new WSServer({port: port});

  server.on("connection", function(ws) {

    serversides.push(ws);

    ws.on("close", function() {
      serversides.splice(serversides.indexOf(ws), 1);
    });

    ws.on("message", function(data, flags) {
      var options = {};
      if (flags.binary) {
        options.binary = true;
      }
      send(data, options, ws);
    });

  });

});

urls.forEach(function(url) {

  var ws = new WSClient(url);

  ws.on("open", function() {
    clientsides.push(ws);
  });

    ws.on("close", function() {
      clientsides.splice(clientsides.indexOf(ws), 1);
    });

    ws.on("message", function(data, flags) {
      var options = {};
      if (flags.binary) {
        options.binary = true;
      }
      send(data, options, ws);
    });

});
