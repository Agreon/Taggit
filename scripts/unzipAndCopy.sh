#!/bin/bash
echo "unzip Landingpage"
unzip /var/www/html/Landingpage.zip -d /var/www/html/taggit
unzip /var/www/html/Frontend.zip -d /var/www/html/taggit/taggitapp/dist

# sudo service apache2 restart
