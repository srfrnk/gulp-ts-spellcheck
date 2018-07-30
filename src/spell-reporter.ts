import * as File from 'vinyl';
import { PluginError } from 'gulp-util';

export default class SpellReporter {
    private errors: string[] = [];

    constructor(options: any = {}) { /**/ }

    public reportFile(file: File, through: any) {
        if (file.errors.length > 0) {
            this.errors.push(`${file.path}: ${file.errors.join(' , ')}`);
        }
    }

    public error(through: any): string {
        if (this.errors.length > 0) {
            return `\nSpelling errors:\n${this.errors.join('\n')}`;
        } else {
            return null;
        }
    }
}
