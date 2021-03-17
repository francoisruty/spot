"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDiscriminator = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const types_1 = require("../../types");
/**
 * Checks that all union types have a discriminator. A discriminator is *not* required for:
 * - a two type union where one type is `null`, e.g. `String | null`
 * - a union composed of `null` and other types of the same primitive type, e.g. `"one" | "two" | "three" | null`
 *
 * @param contract a contract
 */
function hasDiscriminator(contract) {
    const typeTable = types_1.TypeTable.fromArray(contract.types);
    const violations = [];
    contract.endpoints.forEach(endpoint => {
        if (endpoint.request) {
            endpoint.request.headers.forEach(header => {
                findDisriminatorViolations(header.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) request header (${header.name}) contains a union type with no discriminator: #/${path}`
                    });
                });
            });
            endpoint.request.pathParams.forEach(pathParam => {
                findDisriminatorViolations(pathParam.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) request path parameter (${pathParam.name}) contains a union type with no discriminator: #/${path}`
                    });
                });
            });
            endpoint.request.queryParams.forEach(queryParam => {
                findDisriminatorViolations(queryParam.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) request query parameter (${queryParam.name}) contains a union type with no discriminator: #/${path}`
                    });
                });
            });
            if (endpoint.request.body) {
                findDisriminatorViolations(endpoint.request.body.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) request body contains a union type with no discriminator: #/${path}`
                    });
                });
            }
        }
        endpoint.responses.forEach(response => {
            response.headers.forEach(header => {
                findDisriminatorViolations(header.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) response (${response.status}) header (${header.name}) contains a union type with no discriminator: #/${path}`
                    });
                });
            });
            if (response.body) {
                findDisriminatorViolations(response.body.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) response (${response.status}) body contains a union type with no discriminator: #/${path}`
                    });
                });
            }
        });
        if (endpoint.defaultResponse) {
            endpoint.defaultResponse.headers.forEach(header => {
                findDisriminatorViolations(header.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) response (default) header (${header.name}) contains a union type with no discriminator: #/${path}`
                    });
                });
            });
            if (endpoint.defaultResponse.body) {
                findDisriminatorViolations(endpoint.defaultResponse.body.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) response (default) body contains a union type with no discriminator: #/${path}`
                    });
                });
            }
        }
    });
    return violations;
}
exports.hasDiscriminator = hasDiscriminator;
/**
 * Finds discriminator violations for a given type. The paths to the violations
 * will be returned.
 *
 * @param type current type to check
 * @param typeTable type reference table
 * @param typePath type path for context
 */
function findDisriminatorViolations(type, typeTable, typePath = []) {
    switch (type.kind) {
        case types_1.TypeKind.NULL:
        case types_1.TypeKind.BOOLEAN:
        case types_1.TypeKind.BOOLEAN_LITERAL:
        case types_1.TypeKind.STRING:
        case types_1.TypeKind.STRING_LITERAL:
        case types_1.TypeKind.FLOAT:
        case types_1.TypeKind.DOUBLE:
        case types_1.TypeKind.FLOAT_LITERAL:
        case types_1.TypeKind.INT32:
        case types_1.TypeKind.INT64:
        case types_1.TypeKind.INT_LITERAL:
        case types_1.TypeKind.DATE:
        case types_1.TypeKind.DATE_TIME:
            return [];
        case types_1.TypeKind.OBJECT:
            return type.properties.reduce((acc, prop) => {
                return acc.concat(findDisriminatorViolations(prop.type, typeTable, typePath.concat(prop.name)));
            }, []);
        case types_1.TypeKind.ARRAY:
            return findDisriminatorViolations(type.elementType, typeTable, typePath.concat("[]"));
        case types_1.TypeKind.INTERSECTION:
            return type.types.reduce((acc, t) => {
                return acc.concat(findDisriminatorViolations(t, typeTable, typePath.concat()));
            }, []);
        case types_1.TypeKind.UNION: {
            const violationsInUnionTypes = type.types.reduce((acc, t) => {
                return acc.concat(findDisriminatorViolations(t, typeTable, typePath.concat()));
            }, []);
            // Get concrete types excluding null
            const concreteTypes = types_1.possibleRootTypes(type, typeTable);
            const concreteTypesExcludingNull = concreteTypes.filter(types_1.isNotNullType);
            // Union of 2 types with null is valid
            if (concreteTypesExcludingNull.length === 1) {
                return violationsInUnionTypes;
            }
            // Union of primitive type with null is valid
            if (new Set(concreteTypesExcludingNull.map(t => t.kind)).size === 1 &&
                types_1.isPrimitiveType(concreteTypesExcludingNull[0])) {
                return violationsInUnionTypes;
            }
            return type.discriminator === undefined
                ? violationsInUnionTypes.concat(typePath.join("/"))
                : violationsInUnionTypes;
        }
        case types_1.TypeKind.REFERENCE:
            return findDisriminatorViolations(types_1.dereferenceType(type, typeTable), typeTable, typePath);
        default:
            throw assert_never_1.default(type);
    }
}
