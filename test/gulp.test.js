var from = require('from2');
var File = require('vinyl');
const gulpTsSpellcheck = require('../build/index.js').default;

async function gulpProcess(plugin, inputString) {
    var fakeFile = new File({
        cwd: '/', base: '/', path: '/file',
        contents: new Buffer(inputString)
    });

    const promise = new Promise((resolve, reject) => {
        plugin.on('error', (error) => {
            reject(`Exception thrown: ${error.message}`);
        });

        plugin.once('data', function (file) {
            if (!file.isBuffer()) {
                reject('Not a buffer');
            }
            else {
                resolve(file.contents.toString('utf8'));
            }
        });
    });
    plugin.write(fakeFile);
    return await promise;
}

async function expectPromiseToThrow(promise,expectedError) {
    try {
        const result = await promise;
        throw new Error(`'Expected function to throw ${expectedError}, nothing was thrown`);
    }
    catch (error) {
        expect(error).toBe(expectedError);
    }
}

describe('gulp package', () => {
    it('should run', async () => {
        // expect(await gulpProcess(gulpTsSpellcheck(), 'buffer with those contents')).toEqual('');
        expectPromiseToThrow(gulpProcess(gulpTsSpellcheck(), 'buffer with those contents'));
        /*         var fakeFile = new File({
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
         */
    })
});