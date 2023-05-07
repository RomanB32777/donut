#!/bin/bash
echo "update donut app"

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
project_dir=$(dirname "$script_dir")

types_dir="types"
modulesWithTypes=('backend' 'frontend')

cd $project_dir

branch=$(git rev-parse --abbrev-ref HEAD)
echo $branch

cd $types_dir
npm ci --omit=dev
npm run build
rm -rf ./node_modules
cd ..

for i in ${modulesWithTypes[@]}
do
   cp -r ./$types_dir ./$i
done

docker-compose -f docker-compose.dev.yml -p donut-dev up -d --build

for i in ${modulesWithTypes[@]}
do
   rm -rf ./$i/$types_dir
done

# # clear old images
# OLD_IMAGES=$(docker images --quiet --filter=dangling=true)
# [[ -n $OLD_IMAGES ]] && docker rmi $OLD_IMAGES