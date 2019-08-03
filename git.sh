#!/bin/bash

cd ./
if test -e .git
then
  read commitText
  git add .
  git commit -m "$commitText"
  git push
else
  read commitText
  git init
  git add .
  git commit -m "$commitText"
  git remote add origin git@github.com:moling1234/vue_single_page.git
  git push -u origin master
fi
  echo "end"

# git init
# git add README.md
# git commit -m "first commit"
# git remote add origin git@github.com:moling1234/vue_single_page.git
# git push -u origin master