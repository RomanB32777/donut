#!/bin/bash
echo "update app"

root_dir=$(dirname "$0")
types_dir="types"
modulesWithTypes=('backend' 'frontend' 'sockets')

# for i in ${modulesWithTypes[@]}
# do
#     rm -rf $root_dir/$i/$types_dir
# done

GIT='git --git-dir='$root_dir'/.git'

branch=$($GIT rev-parse --abbrev-ref HEAD)

echo $branch

$GIT pull origin $branch
$GIT log -3

for i in ${modulesWithTypes[@]}
do
   cp -r $root_dir/$types_dir $root_dir/$i
done

docker-compose -f $root_dir/docker-compose.yml up -d --build