import { TypescriptParser } from 'typescript-parser';

export default class SpellChecker {
    private dict: string[];
    private parser: TypescriptParser;

    constructor(options: any = {}) {
        this.dict = options.dict || '';
        this.parser = new TypescriptParser();
    }

    public async process(input: string): Promise<string> {
        const parsed = await this.parser.parseSource(input);
        // console.log(parsed.declarations);
        return '';
    }
}
