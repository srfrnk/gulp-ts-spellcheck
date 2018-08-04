var from = require('from2');
var File = require('vinyl');
const gulpTsSpellcheck = require('../build/index.js').default;
const fs = require('fs');

async function gulpProcess(plugin, inputString) {
    var fakeFile = new File({
        cwd: '/',
        base: '/',
        path: '/file',
        contents: new Buffer(inputString)
    });

    const promise = new Promise((resolve, reject) => {
        plugin.on('error', (error) => {
            reject(`Exception thrown: ${error.message}`);
        });

        plugin.once('data', function (file) {
            if (!file.isBuffer()) {
                reject('Not a buffer');
            } else {
                resolve(file.contents.toString('utf8'));
            }
        });
    });
    plugin.write(fakeFile);
    return await promise;
}

describe('gulp package', () => {
    it('should run', async () => {
        const plugin = gulpTsSpellcheck({ dictionary: ['Func'] });
        const result = await gulpProcess(plugin, fs.readFileSync('./test/test-files/correct.checked.ts').toString('utf8'));
        expect(result).toBe('');
    });
    /*
         it('should throw', async () => {
            try {
                const result = await gulpProcess(gulpTsSpellcheck(), 'buffer with those contents');
            } catch (error) {
                return;
            }
            throw new Error('No exception thrown');
        });
     */
});