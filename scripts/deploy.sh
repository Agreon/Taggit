#!/bin/sh
cd ..
# Build
echo "Starting Build.."
cd Frontend
ng build --prod
echo "TODO: Packing bundles"
cd ..

## RM zips
echo "Removing Packages.."
rm Landingpage.zip
rm Frontend.zip
rm Server.zip

# Packing Zips
echo "Packing Frontend"
cd Frontend/dist
zip -r ../../Frontend.zip *
cd ../../

echo "Packing Landinpage"
cd landingpage
zip -r ../Landingpage.zip *
cd ..

echo "Packing Server"
zip -r Server.zip Server/src Server/bin

# Server Cleanup
echo "Server-Cleanup"
ssh root@5.45.96.155 "/var/cleanUp.sh"

# Copy to Server
echo "Starting Deploy.."
scp Landingpage.zip Frontend.zip Server.zip root@5.45.96.155:/var/www/html/

# Starting copyScript
echo "Files Uploaded.."
ssh root@5.45.96.155 "/var/unzipAndCopy.sh"

