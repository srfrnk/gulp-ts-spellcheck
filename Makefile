FORCE:

tslint: FORCE
	npm run tslint

tsc: FORCE
	npm run tsc

jest: tsc
	npm run jest

spell: tsc
	npx gulp spellCheck

release: tslint tsc jest
	npm run release

publish: release
	npm run publish-release
