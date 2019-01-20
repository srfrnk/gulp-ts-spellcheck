import { TypescriptParser, Declaration as TSDeclaration } from 'typescript-parser';
import * as File from 'vinyl';
import IToken from './token';
import LineParser from './LineParser';
import tokenProcessors from './token-processors';
import declarationProcessors from './declaration-processors';
import Declaration from './declaration';
import OutputFile from './output-file';
import * as util from 'util';

// tslint:disable-next-line:no-empty-interface
export interface IParserOptions {
}

export default class Parser {
    private parser: TypescriptParser;

    constructor(options: IParserOptions = {}) {
        this.parser = new TypescriptParser();
    }

    public async process(inputFile: File, outputFile: File & OutputFile): Promise<void> {
        const contents = (inputFile.contents as Buffer).toString('utf8');
        const parsed = await this.parser.parseSource(contents);
        const lineParser = new LineParser(contents);
        outputFile.lineParser = lineParser;
        outputFile.contents = new Buffer('');
        outputFile.tokens = parsed.declarations
            .map((declaration) => declaration as TSDeclaration & Declaration)
            .map((declaration) => {
                declaration.path = inputFile.path;
                declaration.fragment = contents.slice(declaration.start, declaration.end);
                const linePosition = lineParser.findLine(declaration.start);
                if (!!linePosition) {
                    declaration.line = linePosition.line;
                    declaration.column = linePosition.column;
                }
                return declaration;
            })
            .reduce((declarations, declaration) =>
                [...declarations, ...this.processDeclaration(declaration, lineParser)], [] as IToken[]);
    }

    private processDeclaration(declaration: Declaration & TSDeclaration, lineParser: LineParser): IToken[] {
        const type = Object.getPrototypeOf(declaration).constructor.name;
        const token = this.processToken(type, declaration);
        const subDeclarations = this.processSubDeclarations(type, declaration, lineParser);
        return [...token, ...subDeclarations];
    }

    private processToken(type: string, declaration: Declaration & TSDeclaration): IToken[] {
        const tokenProcessor = tokenProcessors[type];
        if (tokenProcessor) {
            const token = tokenProcessor(declaration);
            return token;
        } else {
            // tslint:disable-next-line:no-console
            console.log(`Missing token processor for ${type}: ${declaration.path}:${declaration.line}:${declaration.column}
                ${util.inspect(declaration)}`);
            return [];
        }
    }

    private processSubDeclarations(type: string, declaration: Declaration & TSDeclaration, lineParser: LineParser): IToken[] {
        const declarationProcessor = declarationProcessors[type];
        if (declarationProcessor) {
            const subDeclarations = declarationProcessor(declaration)
                .map((declaration1) => declaration1 as (Declaration & TSDeclaration))
                .filter((declaration1) => declaration1)
                .map((declaration1) => {
                    declaration1.path = declaration.path;
                    const linePosition = lineParser.findLine(declaration1.start);
                    if (!!linePosition) {
                        declaration1.line = linePosition.line;
                        declaration1.column = linePosition.column;
                    }
                    declaration1.fragment = declaration.fragment.slice(
                        declaration1.start - declaration.start,
                        declaration1.end - declaration.start);
                    return declaration1;
                });
            return subDeclarations.reduce(
                (declarations, declaration1) =>
                    [...declarations, ...this.processDeclaration(declaration1, lineParser)], []);
        } else {
            // tslint:disable-next-line:no-console
            console.log(`Missing declaration processor for ${type}: ${declaration.path}:${declaration.line}:${declaration.column}
                ${util.inspect(declaration)}`);
            return [];
        }
    }
}
