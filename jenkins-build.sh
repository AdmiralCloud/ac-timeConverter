#!/usr/bin/env bash

set -e
source .jenkins.conf

CURRENT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')


echo "Checking status of current local branch"
if [[ -z $(git status -s) ]]
then
  echo "Tree is clean"
else
  echo "Tree is dirty, please commit changes before running this script"
  exit
fi

#echo ""
#echo "Merging latest develop branch into local branch"
#git fetch origin develop --quiet
#git merge develop --no-commit --no-ff --quiet

echo ""
echo "Checking out develop branch"
git checkout develop --quiet
git pull origin develop --quiet

echo ""
echo ">>>>>>>>>>>> Please review the changes you are about to commit"
echo ""

git log develop..$CURRENT_BRANCH
echo ""
echo ""
read -p ">>>>>>>>>>>> Are those changes OK? y/n" -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
 git checkout $CURRENT_BRANCH --quiet
 echo ""
 echo "Exiting script now"
 exit 1
fi


echo ""
echo "Merging $CURRENT_BRANCH into develop branch"
git merge --no-ff $CURRENT_BRANCH -m "Merge branch $CURRENT_BRANCH into develop"

echo ""
read -p ">>>>>>>>>>>> Do you want to push those changes to origin/develop? y/n" -n 1 -r
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
 git checkout $CURRENT_BRANCH --quiet
 echo ""
 echo "Exiting script now"
 exit 1
fi


echo ""
echo "Pushing to develop branch"
#git checkout develop
git push origin develop

echo ""
echo "Starting build and deployment on Jenkins"
URL=https://$JENKINS_USER:$JENKINS_USER_TOKEN@$JENKINS_URL/job/$JENKINS_JOB/build?token=$JENKINS_TOKEN
curl $URL

git checkout $CURRENT_BRANCH --quiet

echo ""
echo "Build has been started - you will be informed via HipChat"
