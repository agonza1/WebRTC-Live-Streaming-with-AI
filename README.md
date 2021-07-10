# WebRTC-Live-Streaming
One RTP video stream to many WebRTC clients with real time image detection using Janus and OpenCV

![image](https://user-images.githubusercontent.com/16296681/125168704-67da2800-e16c-11eb-82c6-d68ea9df4a73.png)

In this diagram I send video from a Raspberry Pi but could be any device sending RTP media.

## Dependencies
- NodeJS
- Janus WebRTC Gateway

For the Janus media server you can run the docker here: 
https://github.com/agonza1/janus_gateway/tree/live_streaming

## Starting and debugging

`npm install`

And then. For debugging all logs:

`DEBUG=* node index.js`

For just running without debugging:

`node index.js`

## More info

You can find more info about this hack/project here:

https://webrtc.ventures/2019/08/raspberry-pi-video-live-streaming-with-ai/

https://webrtc.ventures/2019/09/raspberry-pi-video-live-streaming-with-ai-part-2/

