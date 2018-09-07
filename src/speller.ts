import * as path from 'path';
import * as File from 'vinyl';
import OutputFile from './output-file';
import IToken from './token';

export interface ISpellerOptions {
    dictionary?: string[];
    locale?: string;
    dictionaryPath?: string;
}

export default class Speller {
    private spellChecker: any = null;

    constructor(options: ISpellerOptions = {}) {
        // Set default settings:
        options.dictionary = options.dictionary || [];
        options.locale = options.locale || 'en_US';
        options.dictionaryPath = options.dictionaryPath || path.join(__dirname, '../dictionaries');

        // Ensure `spellchecker` is reloaded since it reads locale just once:
        process.env.LANG = options.locale;
        process.env.DICT_PATH = options.dictionaryPath;
        // tslint:disable-next-line:no-string-literal
        delete require.cache['spellchecker'];
        this.spellChecker = require('spellchecker');
        options.dictionary.forEach((word) => {
            this.spellChecker.add(word.toLowerCase());
        });
    }

    public async process(file: File & OutputFile): Promise<void> {
        file.splitTokens = file.tokens
            .reduce((tokens, token) => [...tokens, ...this.splitToken(token)], [])
            .filter((token) => !!token.name && token.name !== '');

        file.errors = file.splitTokens
            .filter((token) => this.isSpellCheckError(token.name));
    }

    private trimToken(token: IToken) {
        const matches = /^([^a-zA-Z]+).*$/.exec(token.name);
        if (matches && matches.length > 1) {
            const skip = matches[1].length;
            token.name = token.name.slice(skip);
            token.position += skip;
        }

        return token;
    }

    private splitToken(token: IToken): IToken[] {
        token = this.trimToken(token);
        if (/^[a-z]*$/.test(token.name) ||
            /^[A-Z]*$/.test(token.name) ||
            /^[A-Z][a-z]*$/.test(token.name)
        ) {
            return [token];
        } else {
            const matches = /^([A-Z][2,])([^A-Z].*)$/.exec(token.name) ||
                /^([A-Z][a-z]+)([^a-z].*)$/.exec(token.name) ||
                /^([a-z]+)([^a-z].*)$/.exec(token.name);
            if (matches) {
                const token1 = {
                    name: matches[1],
                    path: token.path,
                    position: token.position,
                };
                const token2 = {
                    name: matches[2],
                    path: token.path,
                    position: token.position + matches[1].length,
                };
                const token2Split = this.splitToken(token2);
                return [token1, ...token2Split];
            } else {
                return [];
            }
        }
    }

    private isSpellCheckError(name: string): boolean {
        return this.spellChecker.isMisspelled(name.toLowerCase());
    }
}
