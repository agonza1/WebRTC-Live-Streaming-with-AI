const cv = require('opencv4nodejs');
const {
    getDataFilePath
} = require('./utils');

const { runVideoFaceDetection } = require('./commons');

// const videoFile = getDataFilePath('people.mp4');
const videoIn = 'udpsrc port=5000 ! application/x-rtp,format=BGR,payload=96 ! rtph264depay ! h264parse ! avdec_h264 ! decodebin ! videoconvert ! appsink location=/dev/stdout';

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

function detectFaces(img) {
    // we restrict minSize and scaleFactor for faster processing
    const options = {
        minSize: new cv.Size(40, 40),
        scaleFactor: 1.15,
        minNeighbors: 10
    };
    return classifier.detectMultiScale(img.bgrToGray(), options).objects;
}

runVideoFaceDetection(videoIn, detectFaces);