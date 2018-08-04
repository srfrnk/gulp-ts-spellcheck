import Parser from './parser';
import * as File from 'vinyl';
import OutputFile from './output-file';
import IToken from './token';

describe('Parser', () => {
    it('should load', async () => {
        const parser = import('./parser');
        expect(parser).toBeDefined();
    });

    it('should instantiate', () => {
        const parser = new Parser();
        expect(parser).toBeDefined();
    });

    function fakeFile(contents: string = ''): File & OutputFile {
        const file: any = new File({
            cwd: '/', base: '/', path: '/file', contents: new Buffer(contents, 'utf8'),
        });
        return file;
    }

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

    it('should parse interface name', async () => {
        const parser = new Parser();
        const input = fakeFile(`interface IPerson {}`);
        const output = fakeFile();
        await parser.process(input, output);
        const expected: IToken[] = [{ name: 'Person', path: '/file', position: 11 }];
        expect(output.tokens).toEqual(expected);
    });

    it('should parse class name', async () => {
        const parser = new Parser();
        const input = fakeFile(`class Person {}`);
        const output = fakeFile();
        await parser.process(input, output);
        const expected: IToken[] = [{ name: 'Person', path: '/file', position: 6 }];
        expect(output.tokens).toEqual(expected);
    });
});
