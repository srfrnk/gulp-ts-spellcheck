import SpellChecker from './spell-checker';
import * as fs from 'fs';
import * as File from 'vinyl';
import SpellReporter from './spell-reporter';

async function debug() {
    const spellChecker = new SpellChecker();
    const spellReporter = new SpellReporter();

    const data = fs.readFileSync('./test/test-files/correct.checked.ts', 'utf8');
    const file = new File(new Buffer(''));
    await spellChecker.process(new File({ contents: new Buffer(data) }), file);
    spellReporter.reportFile(file);
}

debug();
