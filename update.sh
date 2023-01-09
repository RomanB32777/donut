#!/bin/bash
echo "update donut app"

project_dir=$(dirname "$0")
types_dir="types"
modulesWithTypes=('backend' 'frontend' 'sockets')

# for i in ${modulesWithTypes[@]}
# do
#     rm -rf ./$i/$types_dir
# done

cd $project_dir
ls

branch=$(git rev-parse --abbrev-ref HEAD)

echo $branch

git pull origin $branch

for i in ${modulesWithTypes[@]}
do
   cp -r ./$types_dir ./$i
done

docker-compose up -d --build

# clear old images
OLD_IMAGES=$(docker images --quiet --filter=dangling=true)
[[ -n $OLD_IMAGES ]] && docker rmi $ids