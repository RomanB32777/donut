#!/usr/bin/env bash
echo "update app"

root_dir=$(dirname "$0")
types_dir="types"
branch="donut4"

GIT='git --git-dir='$root_dir'/.git'

$GIT pull origin $branch

cp -r $root_dir/$types_dir $root_dir/backend
cp -r $root_dir/$types_dir $root_dir/frontend
cp -r $root_dir/$types_dir $root_dir/sockets

docker-compose -f $root_dir/docker-compose.yml up -d --build
docker rmi $(docker images -f dangling=true -q)