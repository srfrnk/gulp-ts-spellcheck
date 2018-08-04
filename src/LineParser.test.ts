import './LineParser';
import LineParser from './LineParser';

describe('LineParser', () => {
    it('should load', async () => {
        const lineParser = await import('./LineParser');
        expect(lineParser).toBeDefined();
    });

    it('should instantiate', () => {
        const lineParser = new LineParser('');
        expect(lineParser).toBeDefined();
    });

    it('should parse single line', () => {
        const lineParser = new LineParser('test line 1');
        expect(lineParser.lines).toEqual([0]);
    });

    it('should parse multiple lines', () => {
        const lineParser = new LineParser('test line 1\ntest line 2\ntest line 3');
        expect(lineParser.lines).toEqual([0, 12, 24]);
    });

    it('should find where lines start', () => {
        const input = 'test line 1\ntest line 2\ntest line 3';
        const lineParser = new LineParser(input);

        lineParser.lines.forEach((line) => {
            expect(input.slice(line, line + 4)).toEqual('test');
        });
    });

    it('should find from position with single line', () => {
        const input = 'test line 1';
        const lineParser = new LineParser(input);
        expect(lineParser.findLine(5)).toEqual({ line: 0, column: 5 });
    });

    it('should find line from position', () => {
        const input = 'test line 1\ntest line 2\ntest line 3';
        const lineParser = new LineParser(input);
        expect(lineParser.findLine(22)).toEqual({ line: 1, column: 10 });
    });
});
