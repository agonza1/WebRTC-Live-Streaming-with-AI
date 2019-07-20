#!/bin/sh
#/etc/init.d/rpiLiveVideo:Start streaming WebRTC
### BEGIN INIT INFO
# Provides:     rpiLiveVideo
# Required-Start:       $all
# Required-Stop:
# Default-Start:        2 3 4 5
# Default-Stop:
# Short-Description: Start streaming WebRTC
# Description:
### END INIT INFO

export PATH=$PATH:/usr/local/bin
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules
export DISPLAY=:1

case "$1" in
start)
echo "starting..."
exec forever stop WebRTCLiveStreaming || {
sleep 10
exec 1>/var/log/WebRTCLiveStreaming/startx.out 2>&1
exec forever start --uid WebRTCLiveStreaming --sourceDir /home/codes/WebRTC-Live-Streaming/rpi -l /var/log/WebRTCLiveStreaming/forever.log -o /var/log/WebRTCLiveStreaming/forever.out -a -d -v index.js && v4l2-ctl --set-ctrl=rotate=180
}
sleep 10
exec 1>/var/log/WebRTCLiveStreaming/startx.out 2>&1
exec forever start --uid WebRTCLiveStreaming --sourceDir /home/codes/WebRTC-Live-Streaming/rpi -l /var/log/WebRTCLiveStreaming/forever.log -o /var/log/WebRTCLiveStreaming/forever.out -a -d -v index.js && v4l2-ctl --set-ctrl=rotate=180
;;
stop)
exec 1>/var/log/rpiLiveVideo/stop.out 2>&1
#checkChromium=$(ps –ef | grep –v grep | grep –c chromium-browser)
echo "stopping..."
sleep 1
exec forever stop WebRTCLiveStreaming
;;
*)
echo "Usage: /etc/init.d/WebRTCLiveStreaming {start|stop}"
exit 1
;;
esac
exit 0
