#!/bin/bash
echo "update donut app"

project_dir=$(dirname "$0")
types_dir="types"
modulesWithTypes=('backend' 'frontend')

cd $project_dir

branch=$(git rev-parse --abbrev-ref HEAD)
echo $branch
git stash
git pull origin $branch
git stash pop

cd $types_dir
npm ci --omit=dev
npm run build
rm -rf ./node_modules
cd ..

docker-compose up -d --build

# clear old images
OLD_IMAGES=$(docker images --quiet --filter=dangling=true)
[[ -n $OLD_IMAGES ]] && docker rmi $OLD_IMAGES