#!/bin/bash

logger -s Create the archive.sh script
node postinstall.js

logger -s Create the kflip cron job
echo y | /bin/cp ./script/kflip_cron /etc/cron.d/

logger -s Copy kflip.service to /usr/lib/systemd/system and enable it
echo y | /bin/cp ./scripts/kflip.service /usr/lib/systemd/system
systemctl daemon-reload
systemctl enable kflip

logger -s postinstall kflip success!








