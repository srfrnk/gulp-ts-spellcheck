import * as File from 'vinyl';
import Parser from './parser';
import OutputFile from './output-file';
import Speller from './speller';

export default class SpellChecker {
    private parser: Parser;
    private speller: Speller;

    constructor(options: any = {}) {
        this.parser = new Parser(options);
        this.speller = new Speller(options);
    }

    public async process(inputFile: File, outputFile: File & OutputFile): Promise<void> {
        await this.parser.process(inputFile, outputFile);
        await this.speller.process(outputFile);
    }
}
