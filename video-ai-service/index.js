
const cv = require('opencv4nodejs');

async function main() {
  console.log(cv.getBuildInformation());
  let frame;
  // const wCap = new cv.VideoCapture(0);
  const vCap = new cv.VideoCapture('videotestsrc ! videoconvert ! video/x-raw,width=640,height=480 ! appsink')
  const w = new cv.VideoWriter('appsrc ! videoparse width=640 height=480 ! x264enc ! rtph264pay ! udpsink host=127.0.0.1 port=8004', 0, 25, new cv.Size(640, 480));
  const intvl = setInterval(() => {
    frame = vCap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
      console.log('Frame empty!')
      wCap.reset();
      frame = wCap.read();
    }
    console.log(frame);
    frame.bgrToGray();

    console.error('will write frame');
    w.write(frame);
    console.error('has written frame');

    frame.release();
    // w.release();

  }, 100);

  w.release();
  //child.stdout.pipe(res);
}

main();
