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
exec pkill chromium & forever stop rpiLiveVideo || {
sleep 10
exec 1>/var/log/rpiLiveVideo/startx.out 2>&1
exec sudo startx & forever start --uid rpiLiveVideo --sourceDir /home/codes/rpi-live-video/rpi -l /var/log/rpiLiveVideo/forever.log -o /var/log/rpiLiveVideo/forever.out -a -d -v index.js && v4l2-ctl --set-ctrl=rotate=180
}
sleep 10
exec 1>/var/log/rpiLiveVideo/startx.out 2>&1
exec sudo startx & forever start --uid rpiLiveVideo --sourceDir /home/codes/rpi-live-video/rpi -l /var/log/rpiLiveVideo/forever.log -o /var/log/rpiLiveVideo/forever.out -a -d -v index.js && v4l2-ctl --set-ctrl=rotate=180
;;
stop)
exec 1>/var/log/rpiLiveVideo/stop.out 2>&1
#checkChromium=$(ps –ef | grep –v grep | grep –c chromium-browser)
echo "stopping..."
sleep 1
exec pkill chromium & forever stop rpiLiveVideo
;;
*)
echo "Usage: /etc/init.d/rpiLiveVideo {start|stop}"
exit 1
;;
esac
exit 0
