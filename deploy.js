#!/bin/bash

IP="51.75.28.38"
path="server/public/modernfax/"

#read details
echo -n User:
read username
fullpath="$username@$IP:home/$username/$path"
echo -e "Sending to remote at $fullpath"
scp -R js $username@$IP:/home/$username/$path
