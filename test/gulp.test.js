var from = require('from2');
var File = require('vinyl');
const gulpTsSpellcheck = require('../build/index.js').default;

describe('gulp package', () => {
    it('should run', (done) => {
        var fakeFile = new File({
            cwd: '/', base: '/', path: '/file',
            contents: new Buffer('buffer with those contents')
        });

        var gulpTsSpellcheck1 = gulpTsSpellcheck();

        gulpTsSpellcheck1.on('error', (err) => {
            done.fail(`Error: ${err}`);
            done();
        });

        gulpTsSpellcheck1.write(fakeFile);

        gulpTsSpellcheck1.once('data', function (file) {
            expect(file.isBuffer()).toBeTruthy();
            expect(file.contents.toString('utf8')).toEqual('');
            done();
        });
    })
});