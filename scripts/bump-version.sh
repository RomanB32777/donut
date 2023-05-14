#!/bin/bash
if [ -t 1 ]; then
    exec < /dev/tty
fi

branch=$(git rev-parse --abbrev-ref HEAD)

if [[ $branch = 'main' ]]; then
    PS3='Please bump your version: '
    options=("patch" "minor" "major" "Quit")
    select opt in "${options[@]}"
    do
        case $opt in
            "patch")
                npm version $opt --no-git-tag-version && git add package*.json
                break
                ;;
            "minor")
                npm version $opt --no-git-tag-version && git add package*.json
                break
                ;;
            "major")
                npm version $opt --no-git-tag-version && git add package*.json
                break
                ;;
            "Quit")
                echo "Quit" && exit 1
                break
                ;;
            *) echo "invalid option $REPLY";;
        esac
    done
fi
