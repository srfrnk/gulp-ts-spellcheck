const PLUGIN_NAME = 'gulp-ts-spellcheck';

var through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

function processFile(input: string): string {
    throw new PluginError(PLUGIN_NAME, 'wtf????');
    return '';
}

export default function gulpPlugin(options: any) {
    return through.obj(function (file: any, enc: any, callback: any) {
        try {
            //Empty file and directory not supported
            if (file === null || file.isDirectory()) {
                this.push(file);
                return callback();
            }

            const isBuffer = file.isBuffer();
            if (isBuffer) {
                const aFile = new gutil.File();
                aFile.path = file.path;
                aFile.contents = new Buffer(processFile(file.contents));;
                callback(null, aFile);
            } else {
                this.emit('error',new PluginError(PLUGIN_NAME, 'Only Buffer format is supported'));
                callback();
            }
        }
        catch (error) {
            this.emit('error',error);
            callback();
        }
    });
};
