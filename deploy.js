#!/bin/bash

IP="51.75.28.38"
path="server/public/modernfax"

#read details
echo -n User:
read username
fullpath="$username@$IP:home/$username/$path"
echo -e "Sending to remote at $fullpath"
scp ./js/"package.json" $username@$IP:/home/$username/$path/"package.json"
scp ./js/"server.js" $username@$IP:/home/$username/$path/"server.js"
ssh $username@$IP
