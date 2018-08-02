import { TypescriptParser } from 'typescript-parser';
import * as File from 'vinyl';
import IError from './error';
// tslint:disable-next-line:no-var-requires
const getLineFromPos = require('get-line-from-pos');

export default class SpellChecker {
    private dict: string[];
    private parser: TypescriptParser;

    constructor(options: any = {}) {
        this.dict = options.dict || '';
        this.parser = new TypescriptParser();
    }

    public async process(inputFile: File, outputFile: File): Promise<void> {
        const contents = (inputFile.contents as Buffer).toString('utf8');
        const parsed = await this.parser.parseSource(contents);
        outputFile.errors = [];
        outputFile.contents = new Buffer('');
        parsed.declarations.forEach((dec) => {
            const error: IError = {
                name: dec.name,
                line: getLineFromPos(contents, dec.start),
            };
            outputFile.errors.push(error);
        });
    }
}



