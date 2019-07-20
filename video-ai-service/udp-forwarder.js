var dgram = require("dgram");

var ANY_IPV4_ADDRESS = "0.0.0.0";
var ANY_IPV6_ADDRESS = "::";
var ANY_PORT = 0;
var UDP_IPV4 = "udp4";
var UDP_IPV6 = "udp6";

module.exports = {
    create: function create(destinationPort, destinationAddress, options) {
        if (options == undefined) {
            options = {};
        }
        return new UdpForwarder(destinationPort, destinationAddress, options);
    }
};

function parse(o) {
    if (typeof o === "number") {
        return [o];
    } else if (typeof o === "string") {
        return o.split(",");
    } else if (Array.isArray(o)) {
        return o;
    } else {
        throw new Error("cannot parse object: " + o);
    }
}

function UdpForwarder(destinationPort, destinationAddress, options) {
    this.initialize(destinationPort, destinationAddress, options);
}

UdpForwarder.prototype.initialize = function(destinationPort,
    destinationAddress, options) {
    if (destinationPort === undefined) {
        throw String("Need port to forward datagrams to.");
    }
    this.destinationPort = parse(destinationPort);
    if (destinationAddress === undefined) {
        throw String("Need host name or address to forward datagrams to.");
    }
    this.destinationAddress =parse(destinationAddress);
    this.options = options;
    this.protocol = options.protocol || UDP_IPV4;
    this.listeners = 0;
    this.sourceRemoteEndpoint = undefined;
    this.initializeForwarder();
    this.initializeSource();
};

UdpForwarder.prototype.initializeForwarder = function() {
    var self = this;
    self.evaluateForwarderOptions();
    self.forwarder = dgram.createSocket(self.protocol);
    self.forwarder.on("error", function(err) {
        endDueToError("forwarder error", err);
    });
    self.forwarder.on("message", function(msg, rinfo) {
        if (self.sourceRemoteEndpoint !== undefined) {
            self.source.send(msg, self.sourceRemoteEndpoint.port,
                self.sourceRemoteEndpoint.address);
        }
    });
    self.forwarder.on("listening", function() {
        var address = self.forwarder.address();
        self.forwarderPort = address.port;
        self.invokeCreated();
    });
    self.forwarder.bind(self.forwarderPort, self.forwarderAddress);
};

UdpForwarder.prototype.evaluateForwarderOptions = function() {
    this.forwarderPort = this.options.forwarderPort || ANY_PORT;
    this.forwarderAddress = this.options.forwarderAddress ||
        anyIPAddress(this.protocol);
};

UdpForwarder.prototype.initializeSource = function() {
    var self = this;
    self.evaluateSourceOptions();
    self.source = dgram.createSocket(self.protocol);
    self.source.on("error", function(err) {
        endDueToError("source error", err);
    });
    self.source.on("message", function(msg, rinfo) {
        self.sourceRemoteEndpoint = rinfo;
        self.sendAll(msg);
    });
    self.source.on("listening", function() {
        var address = self.source.address();
        self.port = address.port;
        if (self.options.multicastAddress) {
            console.log("adding membership to group "
                + self.options.multicastAddress
                + " on interface " + self.address);
            self.source.addMembership(self.options.multicastAddress,
                self.address);
        }
        self.invokeCreated();
    });
    self.source.bind(self.port, self.address);
};

UdpForwarder.prototype.evaluateSourceOptions = function() {
    this.port = this.options.port || ANY_PORT;
    this.address = this.options.address || anyIPAddress(this.protocol);
    var isWindows = /^win/.test(process.platform);
    if (!isWindows && this.options.multicastAddress) {
        var address = anyIPAddress(this.protocol);
        if (this.address !== address) {
            console.log("listening for multicast datagrams on a " +
                "specific interface such as " + this.address +
                " is only supported on Windows");
                this.address = address;
        }
    }
};

function anyIPAddress(protocol) {
    if (protocol === UDP_IPV4) {
        return ANY_IPV4_ADDRESS;
    } else if (protocol === UDP_IPV6) {
        return ANY_IPV6_ADDRESS;
    }
};

UdpForwarder.prototype.invokeCreated = function() {
    this.listeners++;
    if (this.listeners == 2 && this.options.created) {
        this.options.created();
    }
};

UdpForwarder.prototype.endDueToError = function(message, err) {
    console.log(message + ":\n" + err.stack);
    this.end();
};

UdpForwarder.prototype.sendAll = function(msg) {
    for (var i = 0; i < this.destinationAddress.length; i++) {
        this.forwarder.send(msg, this.destinationPort[i],
            this.destinationAddress[i]);
    }
};

UdpForwarder.prototype.end = function() {
    this.source.close();
    this.forwarder.close();
};
