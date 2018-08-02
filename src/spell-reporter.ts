import * as File from 'vinyl';
import { PluginError } from 'gulp-util';
import IError from './error';

export default class SpellReporter {
    private errors: string[] = [];

    constructor(options: any = {}) { /**/ }

    public reportFile(file: File, through: any) {
        this.errors.splice(this.errors.length, 0, ...file.errors.map((error: IError) => `${file.path}:${error.line} -> ${error.name}`));
    }

    public error(through: any): string {
        if (this.errors.length > 0) {
            return `\nSpelling errors:\n${this.errors.join('\n')}`;
        } else {
            return null;
        }
    }
}
