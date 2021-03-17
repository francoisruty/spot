"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noNullableFieldsWithinRequestBodies = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const types_1 = require("../../types");
/**
 * Ensures nullable fields are not used in request components.
 *
 * @param contract a contract
 */
function noNullableFieldsWithinRequestBodies(contract) {
    const typeTable = types_1.TypeTable.fromArray(contract.types);
    const violations = [];
    contract.endpoints.forEach(endpoint => {
        var _a;
        if ((_a = endpoint.request) === null || _a === void 0 ? void 0 : _a.body) {
            findNullableFieldViolation(endpoint.request.body.type, typeTable).forEach(path => {
                violations.push({
                    message: `Endpoint (${endpoint.name}) request body contains a nullable field: #/${path}`
                });
            });
        }
    });
    return violations;
}
exports.noNullableFieldsWithinRequestBodies = noNullableFieldsWithinRequestBodies;
/**
 * Finds nullable field violations for a given type. The paths to the violations
 * will be returned.
 *
 * @param type current type to check
 * @param typeTable type reference table
 * @param typePath type path for context
 */
function findNullableFieldViolation(type, typeTable, typePath = []) {
    switch (type.kind) {
        case types_1.TypeKind.NULL:
            return [typePath.join("/")];
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
                return acc.concat(findNullableFieldViolation(prop.type, typeTable, typePath.concat(prop.name)));
            }, []);
        case types_1.TypeKind.ARRAY:
            return findNullableFieldViolation(type.elementType, typeTable, typePath.concat("[]"));
        case types_1.TypeKind.INTERSECTION:
        case types_1.TypeKind.UNION:
            return type.types.reduce((acc, t) => {
                return acc.concat(findNullableFieldViolation(t, typeTable, typePath.concat()));
            }, []);
        case types_1.TypeKind.REFERENCE:
            return findNullableFieldViolation(types_1.dereferenceType(type, typeTable), typeTable, typePath);
        default:
            throw assert_never_1.default(type);
    }
}
