#!/bin/bash
. ./secret

if [[ -z "$SECRET" ]]
then
    echo 'Please get the session cookie from website cookies and enter it here:'
    read SECRET
    echo "SECRET=$SECRET" > ./secret
fi

if [[ -z "$1" ]]
then
    echo 'Need day of challenge as first argument'
    exit
fi

curl -o inputs/$1 --cookie "session=$SECRET" https://adventofcode.com/2017/day/$1/input
