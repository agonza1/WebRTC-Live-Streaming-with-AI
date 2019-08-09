const cv = require('opencv4nodejs');
const {
    grabFrames,
    drawBlueRect,
    addImageOn,
    addWatermark
} = require('./utils');

const w = new cv.VideoWriter('appsrc ! videoconvert ! video/x-raw,format=I420,width=640,height=480,framerate=25/1 ! x264enc bitrate=800 speed-preset=superfast tune=zerolatency ! rtph264pay ! udpsink host=127.0.0.1 port=8004', 0, 25, new cv.Size(640, 480));

exports.runVideoFaceDetection = (src, detectFaces) => grabFrames(src, 1, (frame) => {
    console.time('detection time');
    //const frameResized = frame.resizeToMax(800);

    // detect faces
    const faceRects = detectFaces(frame);
    console.log('Detected faces:');
    console.log(faceRects);
    if (faceRects.length) {
        // draw detection
        faceRects.forEach(faceRect => {
            drawBlueRect(frame, faceRect);
            // add image on face TODO
            addImageOn(frame, faceRect);
        });
    }

    cv.imshow('face detection', frame);
    console.log('writing frame');
    // w.write(frame);

    console.log('wrote frame');
    console.timeEnd('detection time');
});

exports.runVideoWithFaceOnly = (src, detectFaces) => grabFrames(src, 1, (frame) => {
    console.time('detection time');
    //const frameResized = frame.resizeToMax(800);
    let _faceRect = null;
    // detect faces
    const faceRects = detectFaces(frame);
    console.log('Detected faces:');
    console.log(faceRects);
    if (faceRects.length) {
        // draw detection
        faceRects.forEach(faceRect => {
            _faceRect = faceRect;
            drawBlueRect(frame, faceRect);
        });
    }
    let frameWithWatermart = addWatermark(frame);

    cv.imshow('face detection', frameWithWatermart.getRegion(new cv.Rect(_faceRect.x, _faceRect.y, _faceRect.width, _faceRect.height)));
    console.log('writing frame');
    // w.write(frame);

    console.log('wrote frame');
    console.timeEnd('detection time');
});