const cv = require('opencv4nodejs');
const {
    grabFrames,
    drawBlueRect
} = require('../utils');

//src can be a gstreamer command
exports.runVideoFaceDetection = (src, detectFaces) => grabFrames(src, 1, (frame) => {
    console.time('detection time');
    const frameResized = frame.resizeToMax(800);

    // detect faces
    const faceRects = detectFaces(frameResized);
    if (faceRects.length) {
        // draw detection
        faceRects.forEach(faceRect => drawBlueRect(frameResized, faceRect));
    }

    cv.imshow('face detection', frameResized);
    console.timeEnd('detection time');
});