#!/bin/bash
echo "update donut app"

root_dir=$(dirname "$0")
types_dir="types"
modulesWithTypes=('backend' 'frontend' 'sockets')

# for i in ${modulesWithTypes[@]}
# do
#     rm -rf ./$i/$types_dir
# done

cd $root_dir
ls

branch=$(git rev-parse --abbrev-ref HEAD)

echo $branch

git pull # origin $branch
retVal=$?
echo $retVal

for i in ${modulesWithTypes[@]}
do
   cp -r ./$types_dir ./$i
done

docker-compose up -d --build