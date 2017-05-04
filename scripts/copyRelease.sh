#!/bin/bash
echo "Starting Taggit installation"
cp /var/www/nextcloud/data/admin/files/Release.zip /var/www/html/
unzip Release.zip -d taggit
echo "Finished Installation"
