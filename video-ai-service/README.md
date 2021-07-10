# WebRTC RPI Streaming
Application for using opencv on a RTP stream and sending the stream up to a media server for live streaming.

## Dependencies
- OpenCV
- GSTREAMER

## Starting and debugging

`apt install cmake`

You will need to build OpenCV manually to integrate with GStreamer. You can follow the OpenCV most of the installation steps [here](https://medium.com/@galaktyk01/how-to-build-opencv-with-gstreamer-b11668fa09c) but remember to include GSTREAMER=ON when making it:

```
cmake -D CMAKE_BUILD_TYPE=RELEASE \
      -D CMAKE_INSTALL_PREFIX=/usr/local \
      -D INSTALL_C_EXAMPLES=ON \
      -D INSTALL_PYTHON_EXAMPLES=ON \
      -D WITH_TBB=ON \
      -D WITH_V4L=ON \
      -D WITH_QT=ON \
      -D WITH_GSTREAMER=ON \
      -D WITH_GSTREAMER_0_10=OFF \
      -D WITH_OPENGL=ON \
      -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib/modules \
      -D BUILD_EXAMPLES=ON ..
```

Then,

`npm install`

And then

`node index.js`

(It should just convert the video to black and white)

Another demo is the videoFaceDetection.js

# WARNING

This is a work in progess


