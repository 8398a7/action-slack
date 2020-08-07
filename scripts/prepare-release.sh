#!/bin/bash -u

git diff HEAD~..HEAD -- package-lock.json | grep -q '"version":'

if [ $? = 0 ]; then
  echo start release flow

  # setup git
  git config user.name "8398a7"
  git config user.email "8398a7@gmail.com"

  tag=$(git diff HEAD~..HEAD -- package-lock.json | grep version | tail -n 1 | cut -d'"' -f4)
  major=$(echo ${tag:0:1})

  # release flow
  git checkout v$major
  git merge origin/master
  npm ci
  npm install
  npm run release
  git add -A
  git commit -m '[command] npm run release'
  git remote add github "https://$GITHUB_ACTOR:$GITHUB_TOKEN@github.com/$GITHUB_REPOSITORY.git"
  git push github v$major

  # push tag
  git tag v$tag
  git push github --tags
fi
