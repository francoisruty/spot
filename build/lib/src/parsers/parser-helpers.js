"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isQueryParamArrayStrategy = exports.isHttpMethod = exports.getJsDoc = exports.getPropertyName = exports.getPropValueAsObjectOrThrow = exports.getPropValueAsArrayOrThrow = exports.getPropValueAsNumberOrThrow = exports.getPropValueAsStringOrThrow = exports.getObjLiteralPropOrThrow = exports.getObjLiteralProp = exports.getDecoratorConfigOrThrow = exports.parseTypeReferencePropertySignaturesOrThrow = exports.getParameterPropertySignaturesOrThrow = exports.getParamWithDecorator = exports.getMethodWithDecorator = exports.getPropertyWithDecorator = exports.getClassWithDecoratorOrThrow = exports.getSelfAndLocalDependencies = void 0;
const ts_morph_1 = require("ts-morph");
const type_parser_1 = require("./type-parser");
// FILE HELPERS
/**
 * Retrieve all local dependencies of a file recursively including itself.
 *
 * @param file the source file
 * @param visitedFiles visisted files
 */
function getSelfAndLocalDependencies(file, visitedFiles = []) {
    return (file
        .getImportDeclarations()
        // We only care about local imports.
        .filter(id => id.isModuleSpecifierRelative())
        // will throw on file with no import/export statements
        // TODO: provide a warning
        .map(id => id.getModuleSpecifierSourceFileOrThrow())
        .reduce((acc, curr) => {
        if (acc.some(f => f.getFilePath() === curr.getFilePath())) {
            return acc;
        }
        else {
            return getSelfAndLocalDependencies(curr, acc);
        }
    }, visitedFiles.concat(file)));
}
exports.getSelfAndLocalDependencies = getSelfAndLocalDependencies;
/**
 * Retrieve a class from a file with a particular decorator or throw.
 *
 * @param file the source file
 * @param decoratorName name of decorator to search for
 */
function getClassWithDecoratorOrThrow(file, decoratorName) {
    const matchingKlasses = file
        .getClasses()
        .filter(k => k.getDecorator(decoratorName) !== undefined);
    if (matchingKlasses.length !== 1) {
        throw new Error(`expected a decorator @${decoratorName} to be used once, found ${matchingKlasses.length} usages`);
    }
    return matchingKlasses[0];
}
exports.getClassWithDecoratorOrThrow = getClassWithDecoratorOrThrow;
// CLASS HELPERS
/**
 * Retrieve a property from a class declaration with a particular decorator.
 *
 * @param klass class declaration
 * @param decoratorName name of decorator to search for
 */
function getPropertyWithDecorator(klass, decoratorName) {
    const matchingProps = klass
        .getProperties()
        .filter(p => p.getDecorator(decoratorName) !== undefined);
    if (matchingProps.length > 1) {
        throw new Error(`expected a decorator @${decoratorName} to be used only once, found ${matchingProps.length} usages`);
    }
    return matchingProps.length === 1 ? matchingProps[0] : undefined;
}
exports.getPropertyWithDecorator = getPropertyWithDecorator;
/**
 * Retrieve a method from a class declaration with a particular decorator.
 *
 * @param klass class declaration
 * @param decoratorName  name of the decorator to search for
 */
function getMethodWithDecorator(klass, decoratorName) {
    const matchingMethods = klass
        .getMethods()
        .filter(m => m.getDecorator(decoratorName) !== undefined);
    if (matchingMethods.length > 1) {
        throw new Error(`expected a decorator @${decoratorName} to be used only once, found ${matchingMethods.length} usages`);
    }
    return matchingMethods.length === 1 ? matchingMethods[0] : undefined;
}
exports.getMethodWithDecorator = getMethodWithDecorator;
// METHOD HELPERS
/**
 * Retrieve a parameter from a method declaration with a particular decorator.
 *
 * @param method method declaration
 * @param decoratorName name of decorator to search for
 */
function getParamWithDecorator(method, decoratorName) {
    const matchingParams = method
        .getParameters()
        .filter(p => p.getDecorator(decoratorName) !== undefined);
    if (matchingParams.length > 1) {
        throw new Error(`expected a decorator @${decoratorName} to be used only once, found ${matchingParams.length} usages`);
    }
    return matchingParams.length === 1 ? matchingParams[0] : undefined;
}
exports.getParamWithDecorator = getParamWithDecorator;
// PARAMETER HELPERS
/**
 * Retrieve a parameter's property signatures or throw.
 *
 * @param parameter a parameter declaration
 */
function getParameterPropertySignaturesOrThrow(parameter) {
    const typeNode = parameter.getTypeNodeOrThrow();
    return parseTypeReferencePropertySignaturesOrThrow(typeNode);
}
exports.getParameterPropertySignaturesOrThrow = getParameterPropertySignaturesOrThrow;
function parseTypeReferencePropertySignaturesOrThrow(typeNode) {
    if (ts_morph_1.TypeGuards.isTypeReferenceNode(typeNode)) {
        const typeReferenceNode = type_parser_1.getTargetDeclarationFromTypeReference(typeNode);
        if (typeReferenceNode.isErr())
            throw typeReferenceNode;
        const declaration = typeReferenceNode.unwrap();
        // return early if the declaration is an interface
        if (ts_morph_1.TypeGuards.isInterfaceDeclaration(declaration)) {
            return declaration.getProperties();
        }
        const declarationAliasTypeNode = declaration.getTypeNodeOrThrow();
        return parseTypeReferencePropertySignaturesOrThrow(declarationAliasTypeNode);
    }
    else if (ts_morph_1.TypeGuards.isTypeLiteralNode(typeNode)) {
        return typeNode.getProperties();
    }
    else if (ts_morph_1.TypeGuards.isIntersectionTypeNode(typeNode)) {
        return typeNode
            .getTypeNodes()
            .map(parseTypeReferencePropertySignaturesOrThrow)
            .flat();
    }
    throw new Error("expected parameter value to be an type literal or interface object");
}
exports.parseTypeReferencePropertySignaturesOrThrow = parseTypeReferencePropertySignaturesOrThrow;
// DECORATOR HELPERS
/**
 * Retrieve a decorator factory's configuration. The configuration is
 * the first parameter of the decorator and is expected to be an object
 * literal.
 *
 * @param decorator the source decorator
 */
function getDecoratorConfigOrThrow(decorator) {
    // expect a decorator factory
    if (!decorator.isDecoratorFactory()) {
        throw new Error("expected decorator factory");
    }
    // expect a single argument
    const decoratorArgs = decorator.getArguments();
    if (decoratorArgs.length !== 1) {
        throw new Error(`expected exactly one argument, got ${decoratorArgs.length}`);
    }
    // expect the argument to be an object literal expression
    const decoratorArg = decoratorArgs[0];
    if (!ts_morph_1.TypeGuards.isObjectLiteralExpression(decoratorArg)) {
        throw new Error(`expected decorator factory configuration argument to be an object literal`);
    }
    return decoratorArg;
}
exports.getDecoratorConfigOrThrow = getDecoratorConfigOrThrow;
// EXPRESSION HELPERS
/**
 * Retrieves a property from an object literal expression. If provided,
 * the generic parameter will narrow down the available property names
 * allowed.
 *
 * @param objectLiteral a ts-morph object literal expression
 * @param propertyName name of the property
 */
function getObjLiteralProp(objectLiteral, propertyName) {
    const property = objectLiteral.getProperty(propertyName);
    if (!property) {
        return undefined;
    }
    if (!ts_morph_1.TypeGuards.isPropertyAssignment(property)) {
        throw new Error("expected property assignment");
    }
    return property;
}
exports.getObjLiteralProp = getObjLiteralProp;
/**
 * Retrieves a property from an object literal expression or error. If
 * provided, the generic parameter will narrow down the available
 * property names allowed.
 *
 * @param objectLiteral a ts-morph object literal expression
 * @param propertyName name of the property
 */
function getObjLiteralPropOrThrow(objectLiteral, propertyName) {
    const property = objectLiteral.getPropertyOrThrow(propertyName);
    if (!ts_morph_1.TypeGuards.isPropertyAssignment(property)) {
        throw new Error("expected property assignment");
    }
    return property;
}
exports.getObjLiteralPropOrThrow = getObjLiteralPropOrThrow;
// PROPERTY ASSIGNMENT HELPERS
/**
 * Retrieve a property's value as a string or error.
 *
 * @param property the source property
 */
function getPropValueAsStringOrThrow(property) {
    return property.getInitializerIfKindOrThrow(ts_morph_1.ts.SyntaxKind.StringLiteral);
}
exports.getPropValueAsStringOrThrow = getPropValueAsStringOrThrow;
/**
 * Retrieve a property's value as a number or error.
 *
 * @param property the source property
 */
function getPropValueAsNumberOrThrow(property) {
    return property.getInitializerIfKindOrThrow(ts_morph_1.ts.SyntaxKind.NumericLiteral);
}
exports.getPropValueAsNumberOrThrow = getPropValueAsNumberOrThrow;
/**
 * Retrieve a property's value as an array or error.
 *
 * @param property the source property
 */
function getPropValueAsArrayOrThrow(property) {
    return property.getInitializerIfKindOrThrow(ts_morph_1.ts.SyntaxKind.ArrayLiteralExpression);
}
exports.getPropValueAsArrayOrThrow = getPropValueAsArrayOrThrow;
/**
 * Retrieve a property's value as an object or error.
 *
 * @param property the source property
 */
function getPropValueAsObjectOrThrow(property) {
    return property.getInitializerIfKindOrThrow(ts_morph_1.ts.SyntaxKind.ObjectLiteralExpression);
}
exports.getPropValueAsObjectOrThrow = getPropValueAsObjectOrThrow;
// PROPERTY SIGNATURE/DECLARATION HELPERS
/**
 * Retrieve a property's name. This will remove any quotes surrounding the name.
 *
 * @param property property signature
 */
function getPropertyName(property) {
    return property.getNameNode().getSymbolOrThrow().getEscapedName();
}
exports.getPropertyName = getPropertyName;
// JSDOC HELPERS
/**
 * Retrieve a JSDoc for a ts-morph node. The node is expected
 * to have no more than one JSDoc.
 *
 * @param node a JSDocable ts-morph node
 */
function getJsDoc(node) {
    const jsDocs = node.getJsDocs();
    if (jsDocs.length > 1) {
        throw new Error(`expected at most 1 jsDoc node, got ${jsDocs.length}`);
    }
    else if (jsDocs.length === 1) {
        return jsDocs[0];
    }
    return undefined;
}
exports.getJsDoc = getJsDoc;
// TYPE GUARDS
/**
 * Determine if a HTTP method is a supported HttpMethod.
 *
 * @param method the method to check
 */
function isHttpMethod(method) {
    switch (method) {
        case "GET":
        case "POST":
        case "PUT":
        case "PATCH":
        case "DELETE":
            return true;
        default:
            return false;
    }
}
exports.isHttpMethod = isHttpMethod;
/**
 * Determine if a query param array strategy is a supported QueryParamArrayStrategy.
 *
 * @param strategy the strategy to check
 */
function isQueryParamArrayStrategy(strategy) {
    switch (strategy) {
        case "ampersand":
        case "comma":
            return true;
        default:
            return false;
    }
}
exports.isQueryParamArrayStrategy = isQueryParamArrayStrategy;
