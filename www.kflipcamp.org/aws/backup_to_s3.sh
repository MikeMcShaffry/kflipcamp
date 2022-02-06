#!/bin/bash

logger -s "INFO - Starting charlotte backup"
year=`/bin/date +"%Y"`
month=`/bin/date +"%b"`
day=`/bin/date +"%d"`
tar -czf backup.tgz /backup
/usr/local/bin/aws s3 cp --quiet backup.tgz s3://popcornandrobin-net-backups/$year/backup-$year-$month-$day.tgz
logger -s "INFO - Finished charlotte backup to s3://popcornandrobin-net-backups/$year/backup-$year-$month-$day.tgz"

