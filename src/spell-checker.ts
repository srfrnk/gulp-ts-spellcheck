import { TypescriptParser, DeclarationIndex, Declaration, InterfaceDeclaration } from 'typescript-parser';
import * as File from 'vinyl';
import IError from './error';
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
        outputFile.contents = new Buffer('');
        parsed.declarations.forEach((declaration) => {
            this.processDeclaration(declaration, lineParser, outputFile.errors);
        });
    }

    private processDeclaration(declaration: Declaration, lineParser: LineParser, errors: IError[]): void {
        const error: IError = {
            name: declaration.name,
            line: 0,
            column: 0,
        };
        errors.push(error);

        let position = declaration.start;
        if (declaration instanceof InterfaceDeclaration) {
            position += 'interface '.length;
            (declaration as InterfaceDeclaration).properties.forEach((declaration1) => {
                this.processDeclaration(declaration1, lineParser, errors);
            });
            (declaration as InterfaceDeclaration).methods.forEach((declaration1) => {
                this.processDeclaration(declaration1, lineParser, errors);
            });
        }

        const line = lineParser.findLine(position);
        error.line = line.line + 1;
        error.column = line.column + 1;

        // console.log(declaration);
    }
}
