import LineParser from './LineParser';

const input = 'test line 1\ntest line 2\ntest line 3';
const lineParser = new LineParser(input);
console.log(lineParser.lines);
