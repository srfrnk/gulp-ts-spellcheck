FORCE:

tsint: FORCE
	npm run tslint

compile: FORCE
	npm run tsc

jest: FORCE compile
	npm run jest
