"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noNullableArrays = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const types_1 = require("../../types");
/**
 * Ensures that arrays are not part of nullable unions
 *
 * @param contract a contract
 */
function noNullableArrays(contract) {
    const typeTable = types_1.TypeTable.fromArray(contract.types);
    const violations = [];
    contract.endpoints.forEach(endpoint => {
        if (endpoint.request) {
            endpoint.request.headers.forEach(header => {
                findNullableArrayViolations(header.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) request header (${header.name}) contains a nullable array type: #/${path}`
                    });
                });
            });
            endpoint.request.pathParams.forEach(pathParam => {
                findNullableArrayViolations(pathParam.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) request path parameter (${pathParam.name}) contains a nullable array type: #/${path}`
                    });
                });
            });
            endpoint.request.queryParams.forEach(queryParam => {
                findNullableArrayViolations(queryParam.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) request query parameter (${queryParam.name}) contains a nullable array type: #/${path}`
                    });
                });
            });
            if (endpoint.request.body) {
                findNullableArrayViolations(endpoint.request.body.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) request body contains a nullable array type: #/${path}`
                    });
                });
            }
        }
        endpoint.responses.forEach(response => {
            response.headers.forEach(header => {
                findNullableArrayViolations(header.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) response (${response.status}) header (${header.name}) contains a nullable array type: #/${path}`
                    });
                });
            });
            if (response.body) {
                findNullableArrayViolations(response.body.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) response (${response.status}) body contains a nullable array type: #/${path}`
                    });
                });
            }
        });
        if (endpoint.defaultResponse) {
            endpoint.defaultResponse.headers.forEach(header => {
                findNullableArrayViolations(header.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) response (default) header (${header.name}) contains a nullable array type: #/${path}`
                    });
                });
            });
            if (endpoint.defaultResponse.body) {
                findNullableArrayViolations(endpoint.defaultResponse.body.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) response (default) body contains a nullable array type: #/${path}`
                    });
                });
            }
        }
    });
    return violations;
}
exports.noNullableArrays = noNullableArrays;
/**
 * Finds nullable array violations for a given type. The paths to the violations
 * will be returned.
 *
 * @param type current type to check
 * @param typeTable type reference table
 * @param typePath type path for context
 */
function findNullableArrayViolations(type, typeTable, typePath = []) {
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
                return acc.concat(findNullableArrayViolations(prop.type, typeTable, typePath.concat(prop.name)));
            }, []);
        case types_1.TypeKind.ARRAY:
            return findNullableArrayViolations(type.elementType, typeTable, typePath.concat("[]"));
        case types_1.TypeKind.INTERSECTION:
        case types_1.TypeKind.UNION: {
            const violationsInUnionTypes = type.types.reduce((acc, t) => {
                return acc.concat(findNullableArrayViolations(t, typeTable, typePath.concat()));
            }, []);
            const concreteTypes = types_1.possibleRootTypes(type, typeTable);
            return concreteTypes.some(types_1.isArrayType) && concreteTypes.some(types_1.isNullType)
                ? violationsInUnionTypes.concat(typePath.join("/"))
                : violationsInUnionTypes;
        }
        case types_1.TypeKind.REFERENCE:
            return findNullableArrayViolations(types_1.dereferenceType(type, typeTable), typeTable, typePath);
        default:
            throw assert_never_1.default(type);
    }
}
