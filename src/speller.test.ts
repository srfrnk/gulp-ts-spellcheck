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

        it('should split doubleWord', async () => {
            await testTokensForEqual([{ name: 'fooBar', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 13 }]);
        });

        it('should split _DoubleWord', async () => {
            await testTokensForEqual([{ name: '_FooBar', path: '/file', position: 10 }],
                [{ name: 'Foo', path: '/file', position: 11 },
                { name: 'Bar', path: '/file', position: 14 }]);
        });

        it('should split _doubleWord', async () => {
            await testTokensForEqual([{ name: '_fooBar', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 11 },
                { name: 'Bar', path: '/file', position: 14 }]);
        });

        it('should split DoubleWord_', async () => {
            await testTokensForEqual([{ name: 'FooBar_', path: '/file', position: 10 }],
                [{ name: 'Foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 13 }]);
        });

        it('should split doubleWord_', async () => {
            await testTokensForEqual([{ name: 'fooBar_', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 13 }]);
        });

        it('should split Double_Word', async () => {
            await testTokensForEqual([{ name: 'Foo_Bar', path: '/file', position: 10 }],
                [{ name: 'Foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 14 }]);
        });

        it('should split double_Word', async () => {
            await testTokensForEqual([{ name: 'foo_Bar', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 14 }]);
        });

        it('should split Double1Word', async () => {
            await testTokensForEqual([{ name: 'Foo1Bar', path: '/file', position: 10 }],
                [{ name: 'Foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 14 }]);
        });

        it('should split double1Word', async () => {
            await testTokensForEqual([{ name: 'foo1Bar', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 14 }]);
        });

        it('should split double1word', async () => {
            await testTokensForEqual([{ name: 'foo1bar', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 10 },
                { name: 'bar', path: '/file', position: 14 }]);
        });

        it('should split TripleWordWord', async () => {
            await testTokensForEqual([{ name: 'FooBarFoo', path: '/file', position: 10 }],
                [{ name: 'Foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 13 },
                { name: 'Foo', path: '/file', position: 16 }]);
        });

        it('should split tripleWordWord', async () => {
            await testTokensForEqual([{ name: 'fooBarFoo', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 13 },
                { name: 'Foo', path: '/file', position: 16 }]);
        });

        it('should split Triple_Word_Word', async () => {
            await testTokensForEqual([{ name: 'Foo_Bar_Foo', path: '/file', position: 10 }],
                [{ name: 'Foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 14 },
                { name: 'Foo', path: '/file', position: 18 }]);
        });

        it('should split triple_word_word', async () => {
            await testTokensForEqual([{ name: 'foo_bar_foo', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 10 },
                { name: 'bar', path: '/file', position: 14 },
                { name: 'foo', path: '/file', position: 18 }]);
        });

        it('should split triple_Word_word', async () => {
            await testTokensForEqual([{ name: 'foo_Bar_foo', path: '/file', position: 10 }],
                [{ name: 'foo', path: '/file', position: 10 },
                { name: 'Bar', path: '/file', position: 14 },
                { name: 'foo', path: '/file', position: 18 }]);
        });
    });
});

