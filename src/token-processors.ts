import IToken from './token';
import {
    Declaration as TSDeclaration, InterfaceDeclaration, PropertyDeclaration, FunctionDeclaration, VariableDeclaration,
} from 'typescript-parser';
import Declaration from './declaration';

const tokenProcessors: { [key: string]: (declaration: Declaration & TSDeclaration) => IToken } = {
    InterfaceDeclaration: (declaration: InterfaceDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + 'interface '.length,
        };
        if (token.name.startsWith('I')) {
            token.name = token.name.slice(1);
            token.position += 1;
        }
        console.log(declaration.fragment);
        return token;
    },

    PropertyDeclaration: (declaration: PropertyDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start,
        };
        return token;
    },

    FunctionDeclaration: (declaration: FunctionDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + 'function '.length,
        };
        return token;
    },

    VariableDeclaration: (declaration: VariableDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start,
        };
        return token;
    },

    ParameterDeclaration: (declaration: VariableDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start,
        };
        return token;
    },
};

export default tokenProcessors;

