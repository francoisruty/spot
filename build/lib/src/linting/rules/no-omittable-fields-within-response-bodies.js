"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noOmittableFieldsWithinResponseBodies = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const types_1 = require("../../types");
/**
 * Ensures omittable fields are not used in response bodies.
 *
 * @param contract a contract
 */
function noOmittableFieldsWithinResponseBodies(contract) {
    const typeTable = types_1.TypeTable.fromArray(contract.types);
    const violations = [];
    contract.endpoints.forEach(endpoint => {
        var _a;
        endpoint.responses.forEach(response => {
            if (response.body) {
                findOmittableFieldViolation(response.body.type, typeTable).forEach(path => {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) response (${response.status}) body contains an omittable field: #/${path}`
                    });
                });
            }
        });
        if ((_a = endpoint.defaultResponse) === null || _a === void 0 ? void 0 : _a.body) {
            findOmittableFieldViolation(endpoint.defaultResponse.body.type, typeTable).forEach(path => {
                violations.push({
                    message: `Endpoint (${endpoint.name}) response (default) body contains an omittable field: #/${path}`
                });
            });
        }
    });
    return violations;
}
exports.noOmittableFieldsWithinResponseBodies = noOmittableFieldsWithinResponseBodies;
/**
 * Finds omittable field violations for a given type. The paths to the violations
 * will be returned.
 *
 * @param type current type to check
 * @param typeTable type reference table
 * @param typePath type path for context
 */
function findOmittableFieldViolation(type, typeTable, typePath = []) {
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
        case types_1.TypeKind.OBJECT: {
            const violationsInObjectPropTypes = type.properties.reduce((acc, prop) => {
                return acc.concat(findOmittableFieldViolation(prop.type, typeTable, typePath.concat(prop.name)));
            }, []);
            const violationsInObjectProps = type.properties.reduce((acc, prop) => {
                return prop.optional
                    ? acc.concat(typePath.concat(prop.name).join("/"))
                    : acc;
            }, []);
            return violationsInObjectProps.concat(violationsInObjectPropTypes);
        }
        case types_1.TypeKind.ARRAY:
            return findOmittableFieldViolation(type.elementType, typeTable, typePath.concat("[]"));
        case types_1.TypeKind.INTERSECTION:
        case types_1.TypeKind.UNION:
            return type.types.reduce((acc, t) => {
                return acc.concat(findOmittableFieldViolation(t, typeTable, typePath.concat()));
            }, []);
        case types_1.TypeKind.REFERENCE:
            return findOmittableFieldViolation(types_1.dereferenceType(type, typeTable), typeTable, typePath);
        default:
            throw assert_never_1.default(type);
    }
}
