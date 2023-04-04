#!/bin/bash
echo "update donut app"

types_dir="types"
modulesWithTypes=('backend' 'frontend')

branch=$(git rev-parse --abbrev-ref HEAD)
echo $branch

cd $types_dir
npm ci --omit=dev
npm run build
rm -rf ./node_modules
cd ..

docker-compose -f docker-compose.dev.yml -p donut-dev up -d --build

# # clear old images
# OLD_IMAGES=$(docker images --quiet --filter=dangling=true)
# [[ -n $OLD_IMAGES ]] && docker rmi $OLD_IMAGES