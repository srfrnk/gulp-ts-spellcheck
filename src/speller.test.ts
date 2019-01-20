import * as path from 'path';
import Speller, { ISpellerOptions } from './speller';
import * as File from 'vinyl';
import OutputFile from './output-file';
import IToken from './token';

function fakeFile(contents: string = ''): File & OutputFile {
    const file: any = new File({
        cwd: '/', base: '/', path: '/file', contents: new Buffer(contents, 'utf8'),
    });
    return file;
}

async function runInput(tokens: IToken[], options?: ISpellerOptions): Promise<File & OutputFile> {
    const speller = new Speller(options);
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

    describe('Spelling Errors', () => {
        it('should pass correct word', async () => {
            const output = await runInput([{ name: 'word', path: '/file', position: 0 }]);
            expect(output.errors.length).toEqual(0);
        });

        it('should detect incorrect word', async () => {
            const output = await runInput([{ name: 'wurd', path: '/file', position: 0 }]);
            expect(output.errors).toEqual([{ name: 'wurd', path: '/file', position: 0 }]);
        });

        it('should pass incorrect word in dictionary', async () => {
            const output = await runInput([{ name: 'wurd', path: '/file', position: 0 }], { dictionary: ['wurd'] });
            expect(output.errors.length).toEqual(0);
        });

        describe('issue #1', () => {
            beforeEach(() => {
                jest.resetModuleRegistry(); // Ensure `spellchecker` is reloaded since it reads locale just once
            });

            it('should pass en-US word when no locale set', async () => {
                const output = await runInput([{ name: 'formated', path: '/file', position: 0 }], {});
                expect(output.errors.length).toEqual(0);
            });

            it('should throw error when en-US locale used but no en-US in dictionary path', () => {
                expect(runInput(
                    [{ name: 'spezielles', path: '/file', position: 0 }],
                    { dictionaryPath: path.join(__dirname, '../test/dictionaries') }))
                    .rejects.toBeDefined();
            });

            it('should fail de-DE word when no locale set', async () => {
                const output = await runInput([{ name: 'spezielles', path: '/file', position: 0 }], {});
                expect(output.errors).toEqual([{ name: 'spezielles', path: '/file', position: 0 }]);
            });

            it('should fail en-UK word when no locale set', async () => {
                const output = await runInput([{ name: 'colourist', path: '/file', position: 0 }], {});
                expect(output.errors).toEqual([{ name: 'colourist', path: '/file', position: 0 }]);
            });

            it('should fail en-US word when locale set to en-GB', async () => {
                const output = await runInput([{ name: 'colorist', path: '/file', position: 0 }],
                    { locale: 'en_GB', dictionaryPath: path.join(__dirname, '../test/dictionaries') });
                expect(output.errors).toEqual([{ name: 'colorist', path: '/file', position: 0 }]);
            });

            it('should fail en-US word when locale set to de-DE', async () => {
                const output = await runInput([{ name: 'colorist', path: '/file', position: 0 }],
                    { locale: 'de_DE', dictionaryPath: path.join(__dirname, '../test/dictionaries') });
                expect(output.errors).toEqual([{ name: 'colorist', path: '/file', position: 0 }]);
            });

            it('should pass de-DE word when locale set to de-DE', async () => {
                const output = await runInput([{ name: 'spezielles', path: '/file', position: 0 }],
                    { locale: 'de_DE', dictionaryPath: path.join(__dirname, '../test/dictionaries') });
                expect(output.errors.length).toEqual(0);
            });

            it('should pass en-UK word when locale set to en-GB', async () => {
                const output = await runInput([{ name: 'colourist', path: '/file', position: 0 }],
                    { locale: 'en_GB', dictionaryPath: path.join(__dirname, '../test/dictionaries') });
                expect(output.errors.length).toEqual(0);
            });
        });
    });
});
