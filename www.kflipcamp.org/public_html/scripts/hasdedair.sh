#!/bin/bash

# Last update to this file was 2021-Mar-06

ISDEDAIR=0
DEDAIRCOUNTER=0
DEDAIRVOLUME="-65"
DEDAIRALERT=3
SNSARN="arn:aws:sns:us-east-1:925343309615:kfliphasdedair"

logger -s "hasdedair.sh has started"

while :
do

   VOLUME=$(ffmpeg -t 5 -i http://www.kflipcamp.org:8000/kflip -af "volumedetect" -f null /dev/null 2>&1 >/dev/null | grep  "mean_volume" | cut -d " " -f 5)

   if awk 'BEGIN {exit !('$VOLUME' <= '$DEDAIRVOLUME')}'; then
      DEDAIRCOUNTER=$((DEDAIRCOUNTER+1))
      if [ $DEDAIRCOUNTER -eq 1 ]; then
         logger -s "Volume is $VOLUME - DED AIR might have started."
      elif [ $DEDAIRCOUNTER -eq $DEDAIRALERT ]; then
         logger -s "Volume is $VOLUME - DED AIR is definitely happening!"
         aws sns publish --topic-arn $SNSARN --message "DAMMIT - DED AIR is definitely happening on KFLIP"
      else
         logger -s "Volume is $VOLUME - DED AIR for $DEDAIRCOUNTER cycles"
      fi
   else
      if [ $DEDAIRCOUNTER -gt 0 ]; then
        DEDAIRCOUNTER=0
        logger -s "Volume is $VOLUME - KFLIP is back on the air!"
        aws sns publish --topic-arn $SNSARN --message "O THANK CLOVIS - KFLIP is back on the air"
      fi
   fi

   sleep 10
done
