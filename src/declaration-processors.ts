import IToken from './token';
import {
    Declaration as TSDeclaration, InterfaceDeclaration, PropertyDeclaration, FunctionDeclaration, VariableDeclaration,
    ParameterDeclaration,
} from 'typescript-parser';
import Declaration from './declaration';

type DeclarationMixed = Declaration & TSDeclaration;

const declarationProcessors: { [key: string]: (declaration: DeclarationMixed) => TSDeclaration[] } = {
    InterfaceDeclaration: (declaration: Declaration & InterfaceDeclaration) =>
        [...declaration.properties, ...declaration.accessors, ...declaration.methods],

    PropertyDeclaration: (declaration: Declaration & PropertyDeclaration) => [],

    FunctionDeclaration: (declaration: Declaration & FunctionDeclaration) =>
        [...declaration.parameters, ...declaration.variables],

    VariableDeclaration: (declaration: Declaration & VariableDeclaration) => [],

    ParameterDeclaration: (declaration: Declaration & ParameterDeclaration) => [],
};


export default declarationProcessors;

