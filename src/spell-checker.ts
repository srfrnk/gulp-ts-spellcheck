import { TypescriptParser, DeclarationIndex, Declaration, InterfaceDeclaration } from 'typescript-parser';
import * as File from 'vinyl';
import IToken from './token';
import LineParser from './LineParser';

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
        const lineParser = new LineParser(contents);
        outputFile.errors = [];
        outputFile.lineParser = lineParser;
        outputFile.contents = new Buffer('');
        parsed.declarations.forEach((declaration) => {
            this.processDeclaration(inputFile.path, declaration, outputFile.errors);
        });
    }

    private processDeclaration(path: string, declaration: Declaration, errors: IToken[]): void {
        const token: IToken = {
            path,
            name: declaration.name,
            position: declaration.start,
        };
        errors.push(token);

        if (declaration instanceof InterfaceDeclaration) {
            token.position += 'interface '.length;
            if (token.name.startsWith('I')) {
                token.name = token.name.slice(1);
                token.position += 1;
            }

            (declaration as InterfaceDeclaration).properties.forEach((declaration1) => {
                this.processDeclaration(path, declaration1, errors);
            });
            (declaration as InterfaceDeclaration).methods.forEach((declaration1) => {
                this.processDeclaration(path, declaration1, errors);
            });
        }
        // console.log(declaration);
    }
}
