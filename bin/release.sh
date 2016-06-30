#!/usr/bin/env bash
set -e

merge () {
  git pull -r --tags --quiet origin master
  git checkout master
  git merge develop
}

script () {
  gulp changelog
  git add -A
}

version () {
  type=${1:-patch}
  mversion -n -m "feat(release): %s" ${type}
}

postversion () {
  git push --follow-tags
  git co develop
  git rebase master
  git push
}


merge
script
version ${1}
postversion
