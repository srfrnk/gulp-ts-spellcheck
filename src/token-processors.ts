import IToken from './token';
import {
    Declaration as TSDeclaration, InterfaceDeclaration, PropertyDeclaration, FunctionDeclaration,
    VariableDeclaration, ClassDeclaration, MethodDeclaration, ConstructorDeclaration, DefaultDeclaration,
    GetterDeclaration, EnumDeclaration, TypeAliasDeclaration,
} from 'typescript-parser';
import Declaration from './declaration';

const tokenProcessors: { [key: string]: (declaration: Declaration & TSDeclaration) => IToken[] } = {
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
        return [token];
    },

    ClassDeclaration: (declaration: ClassDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + 'class '.length,
        };
        return [token];
    },

    PropertyDeclaration: (declaration: PropertyDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + declaration.fragment.indexOf(declaration.name),
        };
        return [token];
    },

    FunctionDeclaration: (declaration: FunctionDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + 'function '.length,
        };
        return [token];
    },

    ConstructorDeclaration: (declaration: ConstructorDeclaration & Declaration) => {
        return [];
    },

    MethodDeclaration: (declaration: MethodDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + declaration.fragment.indexOf(declaration.name),
        };
        return [token];
    },

    VariableDeclaration: (declaration: VariableDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + declaration.fragment.indexOf(declaration.name),
        };
        return [token];
    },

    ParameterDeclaration: (declaration: VariableDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + declaration.fragment.indexOf(declaration.name),
        };
        return [token];
    },

    DefaultDeclaration: (declaration: DefaultDeclaration & Declaration) => {
        return [];
    },

    GetterDeclaration: (declaration: GetterDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + declaration.fragment.indexOf(declaration.name),
        };
        return [token];
    },

    EnumDeclaration: (declaration: EnumDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + declaration.fragment.indexOf(declaration.name),
        };
        return [token];
    },

    TypeAliasDeclaration: (declaration: TypeAliasDeclaration & Declaration) => {
        const token: IToken = {
            path: '',
            name: declaration.name,
            position: declaration.start + declaration.fragment.indexOf(declaration.name),
        };
        return [token];
    },
};

export default tokenProcessors;

