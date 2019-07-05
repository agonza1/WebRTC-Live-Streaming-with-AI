const express = require('express');
const child_process = require('child_process');
const cors = require('cors');
const util = require('util');
const serveIndex = require('serve-index');
const io = require('socket.io-client');
const signaling_backend = process.env.SIGNALING_SERVER || 'agonza1.tk';
var socket = io.connect('https://' + signaling_backend);
const exec = util.promisify(child_process.exec);
const cv = require('opencv4nodejs');

const app = express();

const room_name = process.env.ROOM_NAME || 'agonza1';

app.use(cors());
app.use(express.static('public'));
app.use('/', serveIndex('public'));

async function main() {
  const wCap = new cv.VideoCapture(0);
  const intvl = setInterval(() => {
    let frame = wCap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
      wCap.reset();
      frame = wCap.read();
    }
    console.log(frame);
  }, 0);
}

main();

async function off_camera_driver() {
  const { stdout, stderr } = await exec("kill $(lsof /dev/video0  | awk '{print $2}')");
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

class Call {
  constructor(id, room, status, process) {
    this.id = id;
    this.room = room;
    this.status = status;
    this.process = process;
    this.changeStatus = function (status) {
      this.status = status;
    }
  }

  startCall(token) {
    var that = this;
    console.log('Token: ' + token);
    that.changeStatus('started');
  }

  endCall(process) {
    console.log('kill process');
    // process.stdin.pause();
    // process.kill();
    this.changeStatus('ended');
  }
}

var deviceId = process.env.DEVICE_ID || 'rpi-test';
var myCall = new Call(deviceId, room_name, 'generated');
myCall.startCall();
