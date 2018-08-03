import * as File from 'vinyl';
import OutputFile from './output-file';

/* tslint:disable-next-line:no-var-requires  */ /* tslint:disable-next-line:variable-name */
const SpellChecker = require('spellchecker');

export default class Speller {
    constructor(options: any = {}) {
        //
    }

    public async process(file: File & OutputFile): Promise<void> {
        file.errors = file.tokens.filter((token) => !this.spellCheckToken(token.name));
    }

    private spellCheckToken(name: string): boolean {
        return false;
    }
}
