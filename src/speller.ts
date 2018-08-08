import * as File from 'vinyl';
import OutputFile from './output-file';
import IToken from './token';

// tslint:disable-next-line:no-var-requires
const spellChecker = require('spellchecker');

export interface ISpellerOptions {
    dictionary: string[];
}

export default class Speller {
    constructor(options: ISpellerOptions = { dictionary: [] }) {
        (options.dictionary || []).forEach((word) => {
            spellChecker.add(word.toLowerCase());
        });
    }

    public async process(file: File & OutputFile): Promise<void> {
        file.splitTokens = file.tokens
            .map((token) => {
                if (token.name.startsWith('_')) {
                    token.name = token.name.slice(1);
                    token.position++;
                }
                return token;
            })
            .reduce((tokens, token) => [...tokens, ...this.splitToken(token)], []);

        file.errors = file.splitTokens
            .filter((token) => this.isSpellCheckError(token.name));
    }

    private splitToken(token: IToken): IToken[] {
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
        return spellChecker.isMisspelled(name.toLowerCase());
    }
}
