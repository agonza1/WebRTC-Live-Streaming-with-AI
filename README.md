# WebRTC-Live-Streaming
One RTP video stream to many WebRTC clients with real time image detection using Janus and OpenCV

##Dependencies
- NodeJS
- Janus WebRTC Gateway

For the Janus media server you can run the docker here: 
https://github.com/agonza1/janus_gateway/tree/live_streaming

##Starting and debugging

`npm install`

And then. For debugging all logs:

`DEBUG=* node index.js`

For just running without debugging:

`node index.js`


