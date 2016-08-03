#!/bin/sh
npm run lint

RESULT=$?
[ $RESULT -ne 0 ] && exit 1

npm run flow
RESULT=$?

[ $RESULT -ne 0 ] && exit 1

echo "Check @wip tags in features"

grep -R @wip features/
RESULT=$?

[ $RESULT -eq 0 ] && echo "Remove @wip tags" && exit 1

echo "Check describe.only in test"

grep -R describe\.only test/
RESULT=$?

[ $RESULT -eq 0 ] && echo "Remove describe.only" && exit 1

npm run test
RESULT=$?

[ $RESULT -ne 0 ] && exit 1

exit 0
