import LineParser from './LineParser';
import IToken from './token';

// tslint:disable-next-line:interface-name
export default interface OutputFile {
    lineParser: LineParser;
    tokens: IToken[];
    errors: IToken[];
}
