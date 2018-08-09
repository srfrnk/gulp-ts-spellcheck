FORCE:

tslint: FORCE
	npm run tslint

tsc: FORCE
	npm run tsc

jest: FORCE tsc
	npm run jest

spell: FORCE tsc
	npx gulp spellCheck

release: tslint tsc jest
	npm run release

publish: release
	npm run publish-release
