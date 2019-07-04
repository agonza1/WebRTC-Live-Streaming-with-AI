// Configuration is static just for testing
var config = {};

// Frontend Server configuration
config.server = {
    // Socket.io based (so WebSockets)
    ws: {
        // Port to bind to for usage over HTTP
        http: 80,
        // Port to bind to for usage over HTTPS
        https: 443,
        cert: './cert/server.crt',
        key: './cert/key.pem'
    }
};

module.exports = config;