"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHeaderTypeSafe = exports.isQueryParamTypeSafe = exports.isPathParamTypeSafe = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const types_1 = require("./types");
/**
 * Check if a type is safe for use as a path parameter.
 *
 * @param type type to check
 * @param typeTable type lookup table
 */
function isPathParamTypeSafe(type, typeTable) {
    switch (type.kind) {
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
            return true;
        case types_1.TypeKind.NULL:
        case types_1.TypeKind.OBJECT:
            return false;
        case types_1.TypeKind.ARRAY:
            return isParamArrayElementTypeSafe(type.elementType, typeTable);
        case types_1.TypeKind.UNION:
        case types_1.TypeKind.INTERSECTION:
            return type.types.every(t => isPathParamTypeSafe(t, typeTable));
        case types_1.TypeKind.REFERENCE:
            return isPathParamTypeSafe(types_1.dereferenceType(type, typeTable), typeTable);
        default:
            throw assert_never_1.default(type);
    }
}
exports.isPathParamTypeSafe = isPathParamTypeSafe;
/**
 * Check if a type is safe for use as a query parameter.
 *
 * @param type type to check
 * @param typeTable type lookup table
 */
function isQueryParamTypeSafe(type, typeTable) {
    switch (type.kind) {
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
            return true;
        case types_1.TypeKind.NULL:
            return false;
        case types_1.TypeKind.ARRAY:
            return isParamArrayElementTypeSafe(type.elementType, typeTable);
        case types_1.TypeKind.OBJECT:
            return type.properties.every(p => isParamObjectPropertyTypeSafe(p.type, typeTable));
        case types_1.TypeKind.UNION:
        case types_1.TypeKind.INTERSECTION:
            return type.types.every(t => isQueryParamTypeSafe(t, typeTable));
        case types_1.TypeKind.REFERENCE:
            return isQueryParamTypeSafe(types_1.dereferenceType(type, typeTable), typeTable);
        default:
            throw assert_never_1.default(type);
    }
}
exports.isQueryParamTypeSafe = isQueryParamTypeSafe;
/**
 * Check if a type is safe for use as a header type.
 *
 * @param type type to check
 * @param typeTable type lookup table
 */
function isHeaderTypeSafe(type, typeTable) {
    switch (type.kind) {
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
            return true;
        case types_1.TypeKind.NULL:
        case types_1.TypeKind.BOOLEAN:
        case types_1.TypeKind.BOOLEAN_LITERAL:
        case types_1.TypeKind.ARRAY:
        case types_1.TypeKind.OBJECT:
            return false;
        case types_1.TypeKind.UNION:
        case types_1.TypeKind.INTERSECTION:
            return type.types.every(t => isHeaderTypeSafe(t, typeTable));
        case types_1.TypeKind.REFERENCE:
            return isHeaderTypeSafe(types_1.dereferenceType(type, typeTable), typeTable);
        default:
            throw assert_never_1.default(type);
    }
}
exports.isHeaderTypeSafe = isHeaderTypeSafe;
/**
 * Check if a type is safe for use as an parameter's object property type.
 *
 * @param type type to check
 * @param typeTable type lookup table
 */
function isParamObjectPropertyTypeSafe(type, typeTable) {
    switch (type.kind) {
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
            return true;
        case types_1.TypeKind.NULL:
        case types_1.TypeKind.ARRAY:
        case types_1.TypeKind.OBJECT:
            return false;
        case types_1.TypeKind.UNION:
        case types_1.TypeKind.INTERSECTION:
            return type.types.every(t => isParamObjectPropertyTypeSafe(t, typeTable));
        case types_1.TypeKind.REFERENCE:
            return isParamObjectPropertyTypeSafe(types_1.dereferenceType(type, typeTable), typeTable);
        default:
            throw assert_never_1.default(type);
    }
}
/**
 * Check if a type is safe for use as a parameter's array element type.
 *
 * @param type type to check
 * @param typeTable type lookup table
 */
function isParamArrayElementTypeSafe(type, typeTable) {
    switch (type.kind) {
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
            return true;
        case types_1.TypeKind.NULL:
        case types_1.TypeKind.ARRAY:
        case types_1.TypeKind.OBJECT:
            return false;
        case types_1.TypeKind.UNION:
        case types_1.TypeKind.INTERSECTION:
            return type.types.every(t => isParamArrayElementTypeSafe(t, typeTable));
        case types_1.TypeKind.REFERENCE:
            return isParamArrayElementTypeSafe(types_1.dereferenceType(type, typeTable), typeTable);
        default:
            throw assert_never_1.default(type);
    }
}
