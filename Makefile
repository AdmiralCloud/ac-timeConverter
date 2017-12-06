MOCHA_OPTS= --slow 0 -A
REPORTER = spec

lint-fix:
	./node_modules/.bin/eslint --fix index.js test/test.js

lint-check:
	./node_modules/.bin/eslint index.js test/test.js

jenkins-build:
	./jenkins-build.sh

rebase:
	git fetch origin develop
	git rebase origin/develop

.PHONY: check
