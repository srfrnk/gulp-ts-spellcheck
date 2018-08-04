var from = require('from2');
var File = require('vinyl');
const fs = require('fs');

describe('gulp package', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.resetAllMocks();
    });

    it('should pass when no spelling errors exist', async () => {
        jest.doMock('spellchecker', () => ({
            add: () => { },
            isMisspelled: () => false
        }));

        const gulp = require('gulp');
        const spellCheck = require('../build/index').default;
        gulp.src('test/test-files/*.ts')
            .on('error', function (err) {
                done(err);
            })
            .pipe(spellCheck({ dictionary: ['Func'] }))
            .pipe(spellCheck.report({}));
    });

    it('should error when spelling errors exist', (done) => {
        jest.doMock('spellchecker', () => ({
            add: () => { },
            isMisspelled: () => true
        }));

        const gulp = require('gulp');
        const spellCheck = require('../build/index').default;
        let error = null;
        gulp.src('test/test-files/*.ts')
            .on('end', function () {
                expect(error).toBeDefined();
                done();
            })
            .pipe(spellCheck({ dictionary: ['Func'] }))
            .pipe(spellCheck.report({}))
            .on('error', function (err) {
                error = err;
            });
    });
});