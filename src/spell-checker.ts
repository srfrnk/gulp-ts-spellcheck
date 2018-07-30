import { TypescriptParser } from 'typescript-parser';
import * as File from 'vinyl';

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
            outputFile.errors.push(dec.name);
        });
    }
}
