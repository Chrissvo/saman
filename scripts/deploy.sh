#!/usr/bin/env bash

# deploy script for solarcalculation

set -e            # fail fast
set -o pipefail   # don't ignore exit codes when piping output
# set -x          # enable debugging

source scripts/functions.sh

echo -e "Hello Christian\n"
info "Ember will start building your project rightaway..."

current_version=`npm version | grep solarcalculation | cut -f2 -d"'"`

if [ -z "$current_version" ]; then
  error "Something went wrong while detecting the current version"
else
  echo -e "\nSolarcalculation is currently on version: ${CYA}$current_version${RES}"
fi

read -p "Do you wish to version bump? " -r
if [ "$REPLY" = "yes" ]; then
  read -p "Your options are [major|minor|patch]: " -r
elif [ -z "$REPLY" ] || [ "$REPLY" = "no" ]; then
  info "We won't bump to a new version"
fi

if [ "$REPLY" = "major" ] || [ "$REPLY" = "minor" ] || [ "$REPLY" = "patch" ]; then
  new_version=`npm version $REPLY --no-git-tag-version || error "invalid version input #1"`

  # remove the 'v' before version number
  new_version=${new_version:1}

  info "New version: $new_version"

  # undo new version
  git checkout package.json

  # create new git flow feature branche
  info 'Running git flow commands...'

  git stash
  git checkout master
  git pull origin master
  git checkout develop
  git pull origin develop
  git flow release start "$new_version"

  npm version $REPLY --no-git-tag-version || error "invalid version input #2"

  # finish git flow feature
  git add package.json
  git commit -m "Automatic version bump"
  git flow release finish -m "$new_version" "$new_version"

  # push release to GitHub
  git push origin develop master

  info "Solarcalculation is pushed to GitHub as version ${BLU}$new_version${RES}"

fi

echo
ember build --environment=production --output-path dist/ --watch false
date=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
deployed_branch=`git symbolic-ref --short -q HEAD`
last_commit_hash=`git rev-parse --verify HEAD`
last_commit_url="https://github.com/chrissvo/solarcalculation/commit/$last_commit_hash"
echo -e "{\"date\":\""$date"\", \"developer\":\""`whoami`"\", \"environment\":\""$environment"\", \"branch\":\""$deployed_branch"\", \"commit\":\""$last_commit_hash"\", \"github_url\":\""$last_commit_url"\"}" > dist/build.json

echo
read -p "Do you want to deploy to Amazon? " -r

if  [ -z "$REPLY" ] || [ "$REPLY" = "no" ]; then
	info "Glad to be of service master"
	exit
else
	info "Starting deploy to S3"
	s3cmd sync dist/ "s3://saman.christian.surf/" --exclude '.DS_Store' --no-progress --acl-private
	info "Ember build deployed to S3"
fi
