"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetDeclarationFromTypeReference = exports.parseType = void 0;
const ts_morph_1 = require("ts-morph");
const errors_1 = require("../errors");
const locations_1 = require("../locations");
const types_1 = require("../types");
const util_1 = require("../util");
const parser_helpers_1 = require("./parser-helpers");
function parseType(typeNode, typeTable, lociTable) {
    // Type references must be parsed first to ensure internal type aliases are handled
    if (ts_morph_1.TypeGuards.isTypeReferenceNode(typeNode)) {
        if (typeNode.getType().isArray() &&
            typeNode.getTypeArguments().length > 0) {
            // TypeScript forbids use of Array constructor without at least one type argument
            return parseArrayConstructorType(typeNode, typeTable, lociTable);
        }
        return parseTypeReference(typeNode, typeTable, lociTable);
        // TODO: discourage native boolean keyword?
    }
    else if (ts_morph_1.TypeGuards.isBooleanKeyword(typeNode)) {
        return util_1.ok(types_1.booleanType());
        // TODO: discourage native string keyword?
    }
    else if (ts_morph_1.TypeGuards.isStringKeyword(typeNode)) {
        return util_1.ok(types_1.stringType());
        // TODO: discourage native number keyword?
    }
    else if (ts_morph_1.TypeGuards.isNumberKeyword(typeNode)) {
        return util_1.ok(types_1.floatType());
    }
    else if (ts_morph_1.TypeGuards.isLiteralTypeNode(typeNode)) {
        return parseLiteralType(typeNode);
    }
    else if (ts_morph_1.TypeGuards.isArrayTypeNode(typeNode)) {
        return parseArrayType(typeNode, typeTable, lociTable);
    }
    else if (ts_morph_1.TypeGuards.isTypeLiteralNode(typeNode)) {
        return parseObjectLiteralType(typeNode, typeTable, lociTable);
    }
    else if (ts_morph_1.TypeGuards.isUnionTypeNode(typeNode)) {
        return parseUnionType(typeNode, typeTable, lociTable);
    }
    else if (ts_morph_1.TypeGuards.isIndexedAccessTypeNode(typeNode)) {
        return parseIndexedAccessType(typeNode, typeTable, lociTable);
    }
    else if (ts_morph_1.TypeGuards.isIntersectionTypeNode(typeNode)) {
        return parseIntersectionTypeNode(typeNode, typeTable, lociTable);
    }
    else {
        throw new errors_1.TypeNotAllowedError("unknown type", {
            file: typeNode.getSourceFile().getFilePath(),
            position: typeNode.getPos()
        });
    }
}
exports.parseType = parseType;
// TODO: store this somewhere else to be more typesafe
const SPOT_TYPE_ALIASES = [
    "Date",
    "DateTime",
    "Number",
    "Double",
    "Float",
    "Integer",
    "Int32",
    "Int64",
    "String"
];
/**
 * Parse an reference node. Reference nodes refer to type aliases and interfaces.
 *
 * @param typeNode AST type node
 * @param typeTable a TypeTable
 * @param lociTable a LociTable
 */
function parseTypeReference(typeNode, typeTable, lociTable) {
    var _a;
    const declarationResult = getTargetDeclarationFromTypeReference(typeNode);
    if (declarationResult.isErr())
        return declarationResult;
    const declaration = declarationResult.unwrap();
    const name = declaration.getName();
    const description = (_a = parser_helpers_1.getJsDoc(declaration)) === null || _a === void 0 ? void 0 : _a.getDescription().trim();
    if (ts_morph_1.TypeGuards.isTypeAliasDeclaration(declaration)) {
        const decTypeNode = declaration.getTypeNodeOrThrow();
        // if the type name is one of of the internal ones ensure they have not been redefined
        // TODO: introduce some more type safety
        if (SPOT_TYPE_ALIASES.includes(name)) {
            if (ts_morph_1.TypeGuards.isTypeReferenceNode(decTypeNode)) {
                throw new Error(`Internal type ${name} must not be redefined`);
            }
            else if (declaration.getType().isString()) {
                switch (name) {
                    case "String":
                        return util_1.ok(types_1.stringType());
                    case "Date":
                        return util_1.ok(types_1.dateType());
                    case "DateTime":
                        return util_1.ok(types_1.dateTimeType());
                    default:
                        throw new Error(`Internal type ${name} must not be redefined`);
                }
            }
            else if (declaration.getType().isNumber()) {
                switch (name) {
                    case "Number":
                    case "Float":
                        return util_1.ok(types_1.floatType());
                    case "Double":
                        return util_1.ok(types_1.doubleType());
                    case "Integer":
                    case "Int32":
                        return util_1.ok(types_1.int32Type());
                    case "Int64":
                        return util_1.ok(types_1.int64Type());
                    default:
                        throw new Error(`Internal type ${name} must not be redefined`);
                }
            }
            else {
                throw new Error(`Internal type ${name} must not be redefined`);
            }
        }
        else {
            if (typeTable.exists(name)) {
                if (!lociTable.equalsMorphNode(locations_1.LociTable.typeKey(name), decTypeNode)) {
                    throw new Error(`Type ${name} defined multiple times`);
                }
            }
            else {
                const targetTypeResult = parseType(decTypeNode, typeTable, lociTable);
                if (targetTypeResult.isErr())
                    return targetTypeResult;
                typeTable.add(name, { type: targetTypeResult.unwrap(), description });
                lociTable.addMorphNode(locations_1.LociTable.typeKey(name), decTypeNode);
            }
            return util_1.ok(types_1.referenceType(name));
        }
    }
    else {
        if (SPOT_TYPE_ALIASES.includes(name)) {
            throw new Error(`Internal type ${name} must not be redefined`);
        }
        else {
            if (typeTable.exists(name)) {
                if (!lociTable.equalsMorphNode(locations_1.LociTable.typeKey(name), declaration)) {
                    throw new Error(`Type ${name} defined multiple times`);
                }
            }
            else {
                const targetTypeResult = parseInterfaceDeclaration(declaration, typeTable, lociTable);
                if (targetTypeResult.isErr())
                    return targetTypeResult;
                typeTable.add(name, { type: targetTypeResult.unwrap(), description });
                lociTable.addMorphNode(locations_1.LociTable.typeKey(name), declaration);
            }
            return util_1.ok(types_1.referenceType(name));
        }
    }
}
/**
 * AST literal types include literal booleans, strings and numbers.
 *
 * @param typeNode AST type node
 */
function parseLiteralType(typeNode) {
    const literal = typeNode.getLiteral();
    if (ts_morph_1.TypeGuards.isBooleanLiteral(literal)) {
        return util_1.ok(types_1.booleanLiteralType(literal.getLiteralValue()));
    }
    else if (ts_morph_1.TypeGuards.isStringLiteral(literal)) {
        return util_1.ok(types_1.stringLiteralType(literal.getLiteralText()));
    }
    else if (ts_morph_1.TypeGuards.isNumericLiteral(literal)) {
        const numericValue = literal.getLiteralValue();
        return util_1.ok(Number.isInteger(numericValue)
            ? types_1.intLiteralType(numericValue)
            : types_1.floatLiteralType(numericValue));
    }
    else if (ts_morph_1.TypeGuards.isNullLiteral(literal)) {
        return util_1.ok(types_1.nullType());
    }
    else {
        return util_1.err(new errors_1.TypeNotAllowedError("unexpected literal type", {
            file: typeNode.getSourceFile().getFilePath(),
            position: typeNode.getPos()
        }));
    }
}
/**
 * Parse an array node.
 *
 * @param typeNode AST type node
 * @param typeTable a TypeTable
 * @param lociTable a LociTable
 *
 * @example
 * ```ts
 * let array: string[];
 * ```
 */
function parseArrayType(typeNode, typeTable, lociTable) {
    const elementDataTypeResult = parseType(typeNode.getElementTypeNode(), typeTable, lociTable);
    if (elementDataTypeResult.isErr())
        return elementDataTypeResult;
    return util_1.ok(types_1.arrayType(elementDataTypeResult.unwrap()));
}
/**
 * Parse an array constructor type.
 *
 * @param typeNode AST type node
 * @param typeTable a TypeTable
 * @param lociTable a LociTable
 */
function parseArrayConstructorType(typeNode, typeTable, lociTable) {
    const typeArguments = typeNode.getTypeArguments();
    if (typeArguments.length !== 1) {
        return util_1.err(new errors_1.ParserError("Array types must declare exactly one argument", {
            file: typeNode.getSourceFile().getFilePath(),
            position: typeNode.getPos()
        }));
    }
    const elementDataTypeResult = parseType(typeArguments[0], typeTable, lociTable);
    if (elementDataTypeResult.isErr())
        return elementDataTypeResult;
    return util_1.ok(types_1.arrayType(elementDataTypeResult.unwrap()));
}
/**
 * Parse an object literal type.
 *
 * NOTE: this parser is limited to `TypeLiteralNode`s. Although `InterfaceDeclaration`s have
 * a very similar structure (both extend `TypeElementMemberedNode`), `InterfaceDeclaration`s
 * may additionally extend other `InterfaceDeclaration`s which should be considered separately.
 *
 * @param typeNode AST type node
 * @param typeTable a TypeTable
 * @param lociTable a LociTable
 */
function parseObjectLiteralType(typeNode, typeTable, lociTable) {
    var _a;
    const indexSignatures = typeNode.getIndexSignatures();
    if (indexSignatures.length > 0) {
        return util_1.err(new errors_1.TypeNotAllowedError("indexed types are not supported", {
            file: indexSignatures[0].getSourceFile().getFilePath(),
            position: indexSignatures[0].getPos()
        }));
    }
    const objectProperties = [];
    for (const ps of typeNode.getProperties()) {
        const propTypeResult = parseType(ps.getTypeNodeOrThrow(), typeTable, lociTable);
        if (propTypeResult.isErr())
            return propTypeResult;
        const prop = {
            name: parser_helpers_1.getPropertyName(ps),
            description: (_a = parser_helpers_1.getJsDoc(ps)) === null || _a === void 0 ? void 0 : _a.getDescription().trim(),
            type: propTypeResult.unwrap(),
            optional: ps.hasQuestionToken()
        };
        objectProperties.push(prop);
    }
    return util_1.ok(types_1.objectType(objectProperties));
}
/**
 * Parse an interface declaration. Resulting object properties will
 * include those from the extended interface hierarchy.
 *
 * @param interfaceDeclaration interface declaration
 * @param typeTable a TypeTable
 * @param lociTable a LociTable
 */
function parseInterfaceDeclaration(interfaceDeclaration, typeTable, lociTable) {
    var _a;
    const indexSignatures = interfaceDeclaration.getIndexSignatures();
    if (indexSignatures.length > 0) {
        return util_1.err(new errors_1.TypeNotAllowedError("indexed types are not supported", {
            file: indexSignatures[0].getSourceFile().getFilePath(),
            position: indexSignatures[0].getPos()
        }));
    }
    const propertySignatures = interfaceDeclaration
        .getType()
        .getProperties()
        .map(propertySymbol => {
        const vd = propertySymbol.getValueDeclarationOrThrow();
        if (!ts_morph_1.TypeGuards.isPropertySignature(vd)) {
            throw new Error("expected property signature");
        }
        return vd;
    });
    const objectProperties = [];
    for (const ps of propertySignatures) {
        const propTypeResult = parseType(ps.getTypeNodeOrThrow(), typeTable, lociTable);
        if (propTypeResult.isErr())
            return propTypeResult;
        const prop = {
            name: parser_helpers_1.getPropertyName(ps),
            description: (_a = parser_helpers_1.getJsDoc(ps)) === null || _a === void 0 ? void 0 : _a.getDescription().trim(),
            type: propTypeResult.unwrap(),
            optional: ps.hasQuestionToken()
        };
        objectProperties.push(prop);
    }
    return util_1.ok(types_1.objectType(objectProperties));
}
/**
 * Parse a union type node.
 *
 * @param typeNode union type node
 * @param typeTable a TypeTable
 * @param lociTable a LociTable
 */
function parseUnionType(typeNode, typeTable, lociTable) {
    const allowedTargetTypes = typeNode
        .getTypeNodes()
        .filter(type => !type.getType().isUndefined());
    switch (allowedTargetTypes.length) {
        case 0:
            return util_1.err(new errors_1.TypeNotAllowedError("malformed union type", {
                file: typeNode.getSourceFile().getFilePath(),
                position: typeNode.getPos()
            }));
        case 1:
            // not a union
            return parseType(allowedTargetTypes[0], typeTable, lociTable);
        default: {
            const types = [];
            for (const tn of allowedTargetTypes) {
                const typeResult = parseType(tn, typeTable, lociTable);
                if (typeResult.isErr())
                    return typeResult;
                types.push(typeResult.unwrap());
            }
            return util_1.ok(types_1.unionType(types, types_1.inferDiscriminator(types, typeTable)));
        }
    }
}
/**
 * Parse an intersection type node.
 *
 * @param typeNode intersection type node
 * @param typeTable a TypeTable
 * @param lociTable a LociTable
 */
function parseIntersectionTypeNode(typeNode, typeTable, lociTable) {
    const allowedTargetTypes = typeNode
        .getTypeNodes()
        .filter(type => !type.getType().isUndefined());
    const types = [];
    for (const tn of allowedTargetTypes) {
        const typeResult = parseType(tn, typeTable, lociTable);
        if (typeResult.isErr())
            return typeResult;
        // Only allow objects, unions, intersections and references
        const typeResultType = typeResult.unwrap();
        const concreteTypes = types_1.possibleRootTypes(typeResultType, typeTable);
        if (!concreteTypes.every(types_1.isObjectType)) {
            return util_1.err(new errors_1.TypeNotAllowedError("Cannot use primitive types in an intersection type", {
                file: typeNode.getSourceFile().getFilePath(),
                position: typeNode.getPos()
            }));
        }
        types.push(typeResultType);
    }
    if (types_1.doesInterfaceEvaluatesToNever(types, typeTable)) {
        return util_1.err(new errors_1.TypeNotAllowedError("intersection evaluates to never and is an illegal argument", {
            file: typeNode.getSourceFile().getFilePath(),
            position: typeNode.getPos()
        }));
    }
    return util_1.ok(types_1.intersectionType(types));
}
/**
 * Parse a indexed access type node.
 *
 * @param typeNode AST type node
 * @param typeTable a TypeTable
 * @param lociTable a LociTable
 */
function parseIndexedAccessType(typeNode, typeTable, lociTable) {
    const propertyAccessChainResult = resolveIndexAccessPropertyAccessChain(typeNode);
    if (propertyAccessChainResult.isErr())
        return propertyAccessChainResult;
    const rootReferenceResult = resolveIndexedAccessRootReference(typeNode);
    if (rootReferenceResult.isErr())
        return rootReferenceResult;
    const refTypeResult = parseTypeReference(rootReferenceResult.unwrap(), typeTable, lociTable);
    if (refTypeResult.isErr())
        return refTypeResult;
    const refType = refTypeResult.unwrap();
    if (refType.kind !== types_1.TypeKind.REFERENCE) {
        return util_1.err(new errors_1.TypeNotAllowedError("Indexed access type must be reference", {
            file: typeNode.getSourceFile().getFilePath(),
            position: typeNode.getPos()
        }));
    }
    const resolvedType = resolveIndexedAccessType(propertyAccessChainResult.unwrap(), refType, typeTable);
    return util_1.ok(resolvedType);
}
/**
 * Resolve the target type for an indexed access type.
 *
 * @param propertyChain properties to traverse
 * @param currentType type to inspect
 * @param typeTable a TypeTable
 */
function resolveIndexedAccessType(propertyChain, currentType, typeTable) {
    if (propertyChain.length === 0)
        return currentType;
    if (currentType.kind === types_1.TypeKind.OBJECT) {
        const property = currentType.properties.find(p => p.name === propertyChain[0]);
        if (property === undefined) {
            throw new Error("Indexed type property not found");
        }
        return resolveIndexedAccessType(propertyChain.slice(1), property.type, typeTable);
    }
    if (currentType.kind === types_1.TypeKind.REFERENCE) {
        const referencedType = typeTable.getOrError(currentType.name).type;
        return resolveIndexedAccessType(propertyChain, referencedType, typeTable);
    }
    throw new Error("Indexed type error");
}
/**
 * Resolve the root reference type of an indexed access type.
 *
 * @param typeNode an indexed access type node
 */
function resolveIndexedAccessRootReference(typeNode) {
    const objectType = typeNode.getObjectTypeNode();
    if (ts_morph_1.TypeGuards.isIndexedAccessTypeNode(objectType)) {
        return resolveIndexedAccessRootReference(objectType);
    }
    if (!ts_morph_1.TypeGuards.isTypeReferenceNode(objectType)) {
        return util_1.err(new errors_1.TypeNotAllowedError("Indexed access type must be reference", {
            file: objectType.getSourceFile().getFilePath(),
            position: objectType.getPos()
        }));
    }
    return util_1.ok(objectType);
}
/**
 * Resolve the property access chain of an indexed access type.
 *
 * @param typeNode an indexed access type node
 * @param accResult property chain result accumulator
 */
function resolveIndexAccessPropertyAccessChain(typeNode, accResult = util_1.ok([])) {
    if (accResult.isErr())
        return accResult;
    const acc = accResult.unwrap();
    const literalTypeNode = typeNode.getIndexTypeNode();
    if (!ts_morph_1.TypeGuards.isLiteralTypeNode(literalTypeNode)) {
        throw new Error("expected type literal");
    }
    const literalTypeResult = parseLiteralType(literalTypeNode);
    if (literalTypeResult.isErr())
        return literalTypeResult;
    const literalType = literalTypeResult.unwrap();
    if (literalType.kind !== types_1.TypeKind.STRING_LITERAL) {
        throw new Error("expected string literal");
    }
    const chainParent = typeNode.getObjectTypeNode();
    if (ts_morph_1.TypeGuards.isIndexedAccessTypeNode(chainParent)) {
        return resolveIndexAccessPropertyAccessChain(chainParent, util_1.ok(acc.concat(literalType.value)));
    }
    return util_1.ok(acc.concat(literalType.value).reverse());
}
/**
 * Extract the target type alias declaration or interface declaration
 * of a type reference.
 *
 * @param typeReference AST type reference node
 */
function getTargetDeclarationFromTypeReference(typeReference) {
    // TODO: check logic
    const symbol = typeReference.getTypeName().getSymbolOrThrow();
    // if the symbol is an alias, it means it the reference is declared from an import
    const targetSymbol = symbol.isAlias()
        ? symbol.getAliasedSymbolOrThrow()
        : symbol;
    const declarations = targetSymbol.getDeclarations();
    const location = typeReference.getSourceFile().getFilePath();
    const line = typeReference.getStartLineNumber();
    const typeName = symbol.getName();
    if (typeName === "Map") {
        return util_1.err(new errors_1.TypeNotAllowedError("Map type is not supported", {
            file: location,
            position: typeReference.getPos()
        }));
    }
    if (declarations.length !== 1) {
        // String interface must not be redefined and must be imported from the Spot native types
        const errorMsg = `${location}#${line}: expected exactly one declaration for ${typeName}`;
        if (typeName === "String") {
            throw new Error(`${errorMsg}\nDid you forget to import String? => import { String } from "@airtasker/spot"`);
        }
        else {
            throw new Error(errorMsg);
        }
        // TODO: same for other internal custom types e.g. Number
    }
    const targetDeclaration = declarations[0];
    // Enums are not supported:
    // enum SomeEnum { A, B, C }
    if (ts_morph_1.TypeGuards.isEnumDeclaration(targetDeclaration)) {
        return util_1.err(new errors_1.TypeNotAllowedError("Enums are not supported", {
            file: targetDeclaration.getSourceFile().getFilePath(),
            position: targetDeclaration.getPos()
        }));
    }
    // References to enum constants (e.g SomeEnum.A) are not supported either.
    if (ts_morph_1.TypeGuards.isEnumMember(targetDeclaration)) {
        return util_1.err(new errors_1.TypeNotAllowedError("Enums are not supported", {
            file: targetDeclaration.getSourceFile().getFilePath(),
            position: targetDeclaration.getPos()
        }));
    }
    if (ts_morph_1.TypeGuards.isInterfaceDeclaration(targetDeclaration) ||
        ts_morph_1.TypeGuards.isTypeAliasDeclaration(targetDeclaration)) {
        return util_1.ok(targetDeclaration);
    }
    throw new Error("expected a type alias or interface declaration");
}
exports.getTargetDeclarationFromTypeReference = getTargetDeclarationFromTypeReference;
