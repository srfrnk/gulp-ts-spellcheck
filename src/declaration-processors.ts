import IToken from './token';
import {
    Declaration as TSDeclaration, InterfaceDeclaration, PropertyDeclaration, FunctionDeclaration, VariableDeclaration,
    ParameterDeclaration,
    ClassDeclaration,
    ConstructorDeclaration,
    MethodDeclaration,
    DefaultDeclaration,
    GetterDeclaration,
    EnumDeclaration,
    TypeAliasDeclaration,
    ObjectBoundParameterDeclaration,
} from 'typescript-parser';
import Declaration from './declaration';

type DeclarationMixed = Declaration & TSDeclaration;

const declarationProcessors: { [key: string]: (declaration: DeclarationMixed) => TSDeclaration[] } = {
    InterfaceDeclaration: (declaration: Declaration & InterfaceDeclaration) =>
        [...declaration.properties, ...declaration.accessors, ...declaration.methods],

    ClassDeclaration: (declaration: Declaration & ClassDeclaration) =>
        [declaration.ctor, ...declaration.properties, ...declaration.accessors, ...declaration.methods],

    PropertyDeclaration: (declaration: Declaration & PropertyDeclaration) => [],

    FunctionDeclaration: (declaration: Declaration & FunctionDeclaration) =>
        [...declaration.parameters, ...declaration.variables],

    ConstructorDeclaration: (declaration: Declaration & ConstructorDeclaration) =>
        [...declaration.parameters, ...declaration.variables],

    MethodDeclaration: (declaration: Declaration & MethodDeclaration) =>
        [...declaration.parameters, ...declaration.variables],

    VariableDeclaration: (declaration: Declaration & VariableDeclaration) => [],

    ParameterDeclaration: (declaration: Declaration & ParameterDeclaration) => [],

    DefaultDeclaration: (declaration: Declaration & DefaultDeclaration) => [/* declaration.exportedDeclaration // ts-parser bug*/],

    GetterDeclaration: (declaration: Declaration & GetterDeclaration) => [],

    EnumDeclaration: (declaration: Declaration & EnumDeclaration) => [],

    TypeAliasDeclaration: (declaration: Declaration & TypeAliasDeclaration) => [],

    ObjectBoundParameterDeclaration: (declaration: Declaration & ObjectBoundParameterDeclaration) => [],
};


export default declarationProcessors;

