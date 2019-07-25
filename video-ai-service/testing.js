const cv = require('opencv4nodejs');

// open video capture
//const vCap = new cv.VideoCapture('./video_test.mp4');
//const vCap = new cv.VideoCapture('udpsrc port=5000 ! application/x-rtp, payload=96 ! rtph264depay ! h264parse ! avdec_h264 ! decodebin ! videoconvert ! video/x-raw,format=(string)BGR ! videoconvert ! appsink name=appsink0 emit-signals$
//const vCap = new cv.VideoCapture('videotestsrc pattern=snow ! video/x-raw,width=1280,height=720 ! appsink name=appsink0')
const vCap = new cv.VideoCapture('udpsrc port=5000 ! application/x-rtp,payload=96 ! rtph264depay ! h264parse ! avdec_h264 ! decodebin ! videoconvert ! appsink location=/dev/stdout');

// loop through the capture
const delay = 10;
let done = false;
let fourcc = vCap.get(6);
//const w = new cv.VideoWriter('appsrc ! videoconvert ! h264parse ! rtph264pay config-interval=1 pt=96 ! udpsink port=8004', 0x00000021, 25, new cv.Size(640, 480))
//const w = new cv.VideoWriter('appsrc name=appsink0 !  videoconvert ! x264enc ! rtph264pay ! udpsink host=3.91.99.131 port=8004', 0, 25, new cv.Size(1280, 720))
//multiple new streams
//const w = new cv.VideoWriter('appsrc ! videoconvert ! x264enc ! mpegtsmux ! udpsink host=127.0.0.1 port=8004', 0, 25, new cv.Size(1280, 720))
//const w = new cv.VideoWriter('videocap.mp4', 0x00000021, 25, new cv.Size(640, 480))
const w = new cv.VideoWriter('appsrc ! videoconvert ! video/x-raw,format=I420,width=640,height=480,framerate=25/1 ! x264enc speed-preset=superfast ! rtph264pay ! udpsink host=127.0.0.1 port=8004', 0, 25, new cv.Size(640, 480));
while (!done) {
    let frame = vCap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
        vCap.reset();
        frame = vCap.read();
    }
    console.log(frame);
    let pFrame = cv.applyColorMap(frame, cv.COLORMAP_AUTUMN);
    // let bwframe = frame.bgrToGray();

    console.error('will write frame');
    w.write(pFrame);
    console.error('has written frame');
    const key = cv.waitKey(delay);
    done = key !== -1 && key !== 255;
}
