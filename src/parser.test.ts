import Parser from './parser';
import * as File from 'vinyl';
import OutputFile from './output-file';
import IToken from './token';

describe('Parser', () => {
    describe('Basic Functionality', () => {
        it('should load', async () => {
            const parser = import('./parser');
            expect(parser).toBeDefined();
        });

        it('should instantiate', () => {
            const parser = new Parser();
            expect(parser).toBeDefined();
        });

        it('should attach lineParser', async () => {
            const parser = new Parser();
            const input = fakeFile();
            const output = fakeFile();
            await parser.process(input, output);
            expect(output.lineParser).toBeDefined();
        });

        it('should attach tokens', async () => {
            const parser = new Parser();
            const input = fakeFile();
            const output = fakeFile();
            await parser.process(input, output);
            expect(output.tokens).toBeDefined();
        });

        it('should not attach errors', async () => {
            const parser = new Parser();
            const input = fakeFile();
            const output = fakeFile();
            await parser.process(input, output);
            expect(output.errors).toBeUndefined();
        });
    });

    function fakeFile(contents: string = ''): File & OutputFile {
        const file: any = new File({
            cwd: '/', base: '/', path: '/file', contents: new Buffer(contents, 'utf8'),
        });
        return file;
    }

    async function runInput(contents: string): Promise<IToken[]> {
        const parser = new Parser();
        const input = fakeFile(contents);
        const output = fakeFile();
        await parser.process(input, output);
        return output.tokens;
    }

    async function testInput(contents: string, expected: IToken[]): Promise<void> {
        expect(await runInput(contents)).toEqual(expected);
    }

    describe('Language Constructs', () => {
        describe('Interface', () => {
            it('should parse interface name', async () => {
                testInput(`interface IPerson {}`, [{ name: 'Person', path: '/file', position: 11 }]);
            });
        });

        describe('Class', () => {
            it('should parse class name', async () => {
                testInput(`class Person {}`, [{ name: 'Person', path: '/file', position: 6 }]);
            });
        });

        describe('Function', () => {
            it('should parse regular function name', async () => {
                testInput(`function Foo(){}`, [{ name: 'Foo', path: '/file', position: 9 }]);
            });
        });
    });
});
