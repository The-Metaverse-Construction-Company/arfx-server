#!/usr/bin/env bash
# change directory to root.
cd ../
sudo docker commit $(sudo docker ps -a -q -f name=^backend-service$) arfxhome/backend-service:development;
sudo docker --config $(pwd) push arfxhome/backend-service:development;
