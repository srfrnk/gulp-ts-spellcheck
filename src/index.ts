const PLUGIN_NAME = 'gulp-ts-spellcheck';

// tslint:disable:no-var-requires
const through = require('through2');
const gutil = require('gulp-util');

import SpellChecker from './spell-checker';
import SpellReporter, { IReporterOptions } from './spell-reporter';
import { ISpellerOptions } from './speller';
import { IParserOptions } from './parser';

const PluginError = gutil.PluginError;

export default function gulpPlugin(options: IParserOptions & ISpellerOptions & IReporterOptions) {
    const processor = new SpellChecker(options);

    async function fileProcessor(file: any, enc: any, callback: any) {
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
                await processor.process(file, aFile);
                callback(null, aFile);
            } else {
                this.emit('error', new PluginError(PLUGIN_NAME, 'Only Buffer format is supported'));
                callback();
            }
        } catch (error) {
            this.emit('error', error.stack);
            callback();
        }
    }

    return through.obj(fileProcessor);
}

(gulpPlugin as any).report = (options: IReporterOptions) => {
    const reporter = new SpellReporter(options);
    return through.obj({},
        function reportFailures(file: any, enc: any, callback: any) {
            reporter.reportFile(file);
            callback(null, file);
        },
        function throwErrors(callback: any) {
            const message = reporter.error();
            callback(!!message ? new PluginError(PLUGIN_NAME, message) : null);
        });
};
