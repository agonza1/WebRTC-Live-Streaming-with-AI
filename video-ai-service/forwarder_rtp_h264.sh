#!/bin/sh
#
# A simple RTP forwarder
#
#  receives H264 encoded RTP video on port 5000
#
#             .-------.      .----------.     .---------.   .-------.   .-----------.
#  RTP        |udpsrc |      | rtpbin   |     |h264depay|   |h264dec|   |udpsink    |
#  port=5000  |      src->recv_rtp recv_rtp->sink     src->sink   src->sink         |
#             '-------'      |          |     '---------'   '-------'   '-----------'

gst-launch-1.0 -v udpsrc port=5000 ! application/x-rtp,format=BGR,payload=96 ! rtph264depay ! h264parse ! avdec_h264 ! decodebin ! videoconvert ! x264enc ! rtph264pay ! udpsink host=127.0.0.1 port=8004