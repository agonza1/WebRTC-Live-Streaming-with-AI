const cv = require('opencv4nodejs');
const {
    grabFrames,
    drawBlueRect
} = require('./utils');

const w = new cv.VideoWriter('appsrc ! videoconvert ! video/x-raw,format=I420,width=640,height=480,framerate=25/1 ! x264enc bitrate=800 speed-preset=superfast tune=zerolatency ! rtph264pay ! udpsink host=127.0.0.1 port=8004', 0, 25, new cv.Size(640, 480));

exports.runVideoFaceDetection = (src, detectFaces) => grabFrames(src, 1, (frame) => {
    console.time('detection time');
    //const frameResized = frame.resizeToMax(800);

    // detect faces
    const faceRects = detectFaces(frame);
    if (faceRects.length) {
        // draw detection
        faceRects.forEach(faceRect => drawBlueRect(frame, faceRect));
    }
    // cv.imshow('face detection', frame);
    console.log('writing frame');
    w.write(frame);
    console.log('wrote frame');
    console.timeEnd('detection time');
});