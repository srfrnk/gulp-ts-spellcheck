const PLUGIN_NAME = 'gulp-ts-spellcheck';

// tslint:disable:no-var-requires
const through = require('through2');
const gutil = require('gulp-util');

import SpellChecker from './spell-checker';

const PluginError = gutil.PluginError;

export default function gulpPlugin(options: any) {
    const processor = new SpellChecker(options);

    return through.obj(function(file: any, enc: any, callback: any) {
        try {
            // Empty file and directory not supported
            if (file === null || file.isDirectory()) {
                this.push(file);
                return callback();
            }

            const isBuffer = file.isBuffer();
            if (isBuffer) {
                const aFile = new gutil.File();
                aFile.path = file.path;
                aFile.contents = new Buffer(processor.process(file.contents));
                callback(null, aFile);
            } else {
                this.emit('error', new PluginError(PLUGIN_NAME, 'Only Buffer format is supported'));
                callback();
            }
        } catch (error) {
            this.emit('error', error);
            callback();
        }
    });
}
