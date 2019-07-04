const express = require('express');
const app = express();
const async = require('async');
// Debugging
const debug = require('debug');
const colors = require('colors');
const config = require("./config.js");
const d = {
    debug: debug('debug'),
    err: debug('error'),
    warn: debug('warn'),
    timer: debug('timer'),
    info: debug('info')
};

app.use(express.static('.'));
// app.get('/', (req, res) => res.send('Hello World!'))

async.series([
        // 1. HTTP
        function(callback) {
            console.log(colors.yellow("[1. HTTP]"));
            if(config.server.ws.http) {
                var http = require('http').Server(app);
                // socket(http);
                http.on('error', function(err) {
                    d.err('HTTP error:', err)
                    if(err.code == 'EADDRINUSE') {
                        callback('Port ' + config.server.ws.http + ' for HTTP backend already in use');
                    }
                });
                http.listen(config.server.ws.http, function() {
                    d.info('HTTP backend listening on *:' + config.server.ws.http + ' (HTTP)');
                    callback(null, "HTTP backend OK");
                });
            } else {
                callback(null, "No HTTP server backend");
            }
        },
        // 2. HTTPS
        function(callback) {
            console.log(colors.yellow("[2. HTTPS]"));
            if(config.server.ws.https) {
                var fs = require('fs');
                var options = {
                    key: fs.readFileSync(config.server.ws.key, 'utf8'),
                    cert: fs.readFileSync(config.server.ws.cert, 'utf8')
                };
                var https = require('https').createServer(options, app);
                // socket(https);
                https.on('error', function(err) {
                    d.err('HTTPS backend error:', err)
                    if(err.code == 'EADDRINUSE') {
                        callback('Port ' + config.server.ws.https + ' for HTTPS backend already in use');
                    }
                });
                https.listen(config.server.ws.https, function() {
                    d.info('HTTPS backend listening on *:' + config.server.ws.https + ' (HTTPS)');
                    callback(null, "HTTPS backend OK");
                });
            } else {
                callback(null, "No HTTPS users backend");
            }
        }
    ],
    function(err, results) {
        if(err) {
            console.log(colors.red("The WebRTC signaling server failed to start"));
            d.err(err);
            process.exit(1);
        } else {
            // We're up and running
            console.log(colors.cyan("Server started!"));
            d.info(results);
        }
    });
