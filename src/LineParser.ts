interface ILinePosition {
    line: number;
    column: number;
}

export default class LineParser {
    private _lines: number[];
    private _totalLength: number;

    constructor(input: string) {
        const lineMatches = this.matchLines(input);
        this._lines = Array.from(lineMatches);
        this._totalLength = input.length;
    }

    public findLine(idx: number): ILinePosition {
        for (let i = 0; i < this._lines.length; i++) {
            if (idx < this._lines[i + 1]) {
                return { line: i, column: idx - this._lines[i] };
            }
        }
        if (idx < this._totalLength) {
            return { line: this._lines.length - 1, column: idx - this._lines[this._lines.length - 1] };
        } else {
            return null;
        }
    }

    public get lines(): number[] {
        return this._lines.slice();
    }

    private *matchLines(input: string): IterableIterator<number> {
        const re = /\n/g;
        yield 0;
        while (re.exec(input)) {
            yield re.lastIndex;
        }
    }
}
