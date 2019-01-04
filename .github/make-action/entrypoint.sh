#!/bin/sh

set -e

# echo $HOME
# echo $GITHUB_WORKFLOW
# echo $GITHUB_ACTION
# echo $GITHUB_ACTOR
# echo $GITHUB_REPOSITORY
# echo $GITHUB_EVENT_NAME
# echo $GITHUB_EVENT_PATH
# echo $GITHUB_WORKSPACE
# echo $GITHUB_SHA
# echo $GITHUB_REF
# echo $GITHUB_TOKE

sh -c "make $*"