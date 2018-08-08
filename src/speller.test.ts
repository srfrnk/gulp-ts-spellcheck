import Speller from './speller';
import * as File from 'vinyl';
import OutputFile from './output-file';
import IToken from './token';

function fakeFile(contents: string = ''): File & OutputFile {
    const file: any = new File({
        cwd: '/', base: '/', path: '/file', contents: new Buffer(contents, 'utf8'),
    });
    return file;
}

async function runInput(tokens: IToken[]): Promise<File & OutputFile> {
    const speller = new Speller();
    const file = fakeFile();
    file.tokens = tokens;
    await speller.process(file);
    return file;
}

async function testTokensForEqual(tokens: IToken[], expected: IToken[]): Promise<void> {
    await testTokens(tokens, async (matcher) => matcher.toEqual(expected));
}

type TokenTester = (matcher: jest.Matchers<IToken[]>) => Promise<any>;

async function testTokens(tokens: IToken[], tester: TokenTester): Promise<void> {
    const matcher = expect((await runInput(tokens)).splitTokens);
    await tester(matcher);
}

describe('Speller', () => {
    describe('Basic Functionality', () => {
        it('should load', async () => {
            const speller = import('./speller');
            expect(speller).toBeDefined();
        });

        it('should instantiate', () => {
            const speller = new Speller();
            expect(speller).toBeDefined();
        });
    });

    describe('Token splitting', () => {
        it('should not split lowercase', async () => {
            await testTokensForEqual([{ name: 'foo', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 10 }]);
        });

        it('should not split UPPERCASE', async () => {
            await testTokensForEqual([{ name: 'FOO', path: '/file', position: 10 }],
                [{ name: 'FOO', path: '/file', position: 10 }]);
        });

        it('should not split Single', async () => {
            await testTokensForEqual([{ name: 'Foo', path: '/file', position: 10 }],
                [{ name: 'Foo', path: '/file', position: 10 }]);
        });

        it('should split DoubleWord', async () => {
            await testTokensForEqual([{ name: 'FooBar', path: '/file', position: 10 }],
                [{ name: 'Foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 13 }]);
        });

    });
});

