#!/bin/sh
npm run lint

RESULT=$?
[ $RESULT -ne 0 ] && exit 1

npm run flow
RESULT=$?

[ $RESULT -ne 0 ] && exit 1

npm run test

[ $RESULT -ne 0 ] && exit 1

exit 0
