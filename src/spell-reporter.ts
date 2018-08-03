import * as File from 'vinyl';
import { PluginError } from 'gulp-util';
import IToken from './token';
import LineParser from './LineParser';

export default class SpellReporter {
    private errors: string[] = [];

    constructor(options: any = {}) { /**/ }

    public reportFile(file: File) {
        this.errors.splice(this.errors.length, 0, ...file.errors
            .map((error: IToken) => {
                const line = (file.lineParser as LineParser).findLine(error.position);
                return `${error.path}[${line.line + 1},${line.column + 1}]: ${error.name}`;
            }));
    }

    public error(): string {
        if (this.errors.length > 0) {
            return `\nSpelling errors:\n${this.errors.join('\n')}`;
        } else {
            return null;
        }
    }
}
