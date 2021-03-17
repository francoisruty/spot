"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeToJsonSchemaType = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const types_1 = require("../../types");
/**
 * Generate a JSON Schema type definition. `objectAdditionalProperties` may
 * be used to configure whether additional properties should be allowed on
 * object types. This can be useful for data validation purposes where
 * property validation can be strict or lenient.
 *
 * @param type a contract type
 * @param objectAdditionalProperties whether to allow additional properties for objects
 */
function typeToJsonSchemaType(type, objectAdditionalProperties = true // TODO: expose proper configuration object
) {
    switch (type.kind) {
        case types_1.TypeKind.NULL:
            return {
                type: "null"
            };
        case types_1.TypeKind.BOOLEAN:
            return {
                type: "boolean"
            };
        case types_1.TypeKind.BOOLEAN_LITERAL:
            return {
                type: "boolean",
                const: type.value
            };
        case types_1.TypeKind.DATE:
            return { type: "string", format: "date" };
        case types_1.TypeKind.DATE_TIME:
            return { type: "string", format: "date-time" };
        case types_1.TypeKind.STRING:
            return {
                type: "string"
            };
        case types_1.TypeKind.STRING_LITERAL:
            return {
                type: "string",
                const: type.value
            };
        case types_1.TypeKind.FLOAT:
        case types_1.TypeKind.DOUBLE:
            return {
                type: "number"
            };
        case types_1.TypeKind.FLOAT_LITERAL:
            return {
                type: "number",
                const: type.value
            };
        case types_1.TypeKind.INT32:
        case types_1.TypeKind.INT64:
            return {
                type: "integer"
            };
        case types_1.TypeKind.INT_LITERAL:
            return {
                type: "integer",
                const: type.value
            };
        case types_1.TypeKind.OBJECT:
            return type.properties.reduce((acc, property) => {
                if (!property.optional) {
                    acc.required.push(property.name);
                }
                acc.properties[property.name] = typeToJsonSchemaType(property.type, objectAdditionalProperties);
                return acc;
            }, {
                type: "object",
                properties: {},
                required: [],
                additionalProperties: objectAdditionalProperties
            });
        case types_1.TypeKind.ARRAY:
            return {
                type: "array",
                items: typeToJsonSchemaType(type.elementType, objectAdditionalProperties)
            };
        case types_1.TypeKind.UNION: {
            const elements = type.types;
            if (elements.length === 0)
                throw new Error("Union type has no elements");
            if (elements.length === 1)
                return typeToJsonSchemaType(elements[0]);
            if (types_1.areBooleanLiteralTypes(elements) ||
                types_1.areStringLiteralTypes(elements) ||
                types_1.areFloatLiteralTypes(elements) ||
                types_1.areIntLiteralTypes(elements)) {
                return singleTypeLiteralsToSchema(elements);
            }
            else {
                // Guaranteed oneOf
                const oneOfElements = elements
                    .filter(types_1.isNotLiteralType)
                    .map(t => typeToJsonSchemaType(t, objectAdditionalProperties));
                const booleanLiterals = elements.filter(types_1.isBooleanLiteralType);
                if (booleanLiterals.length > 0) {
                    oneOfElements.push(singleTypeLiteralsToSchema(booleanLiterals));
                }
                const stringLiterals = elements.filter(types_1.isStringLiteralType);
                if (stringLiterals.length > 0) {
                    oneOfElements.push(singleTypeLiteralsToSchema(stringLiterals));
                }
                const floatLiterals = elements.filter(types_1.isFloatLiteralType);
                if (floatLiterals.length > 0) {
                    oneOfElements.push(singleTypeLiteralsToSchema(floatLiterals));
                }
                const integerLiterals = elements.filter(types_1.isIntLiteralType);
                if (integerLiterals.length > 0) {
                    oneOfElements.push(singleTypeLiteralsToSchema(integerLiterals));
                }
                return {
                    oneOf: oneOfElements
                };
            }
        }
        case types_1.TypeKind.REFERENCE:
            return {
                $ref: `#/definitions/${type.name}`
            };
        case types_1.TypeKind.INTERSECTION: {
            const elements = type.types;
            if (elements.length === 1)
                return typeToJsonSchemaType(elements[0]);
            return {
                allOf: elements
                    .filter(types_1.isNotLiteralType)
                    .map(t => typeToJsonSchemaType(t, objectAdditionalProperties))
            };
        }
        default:
            throw assert_never_1.default(type);
    }
}
exports.typeToJsonSchemaType = typeToJsonSchemaType;
function singleTypeLiteralsToSchema(literals) {
    switch (literals.length) {
        case 0:
            throw new Error("no literals found");
        case 1:
            return typeToJsonSchemaType(literals[0]);
        default:
            if (types_1.areBooleanLiteralTypes(literals)) {
                literals.map(e => e.value);
                return {
                    type: "boolean",
                    enum: literals.map(e => e.value)
                };
            }
            else if (types_1.areStringLiteralTypes(literals)) {
                return {
                    type: "string",
                    enum: literals.map(e => e.value)
                };
            }
            else if (types_1.areFloatLiteralTypes(literals)) {
                return {
                    type: "number",
                    enum: literals.map(e => e.value)
                };
            }
            else if (types_1.areIntLiteralTypes(literals)) {
                return {
                    type: "integer",
                    enum: literals.map(e => e.value)
                };
            }
            else {
                throw new Error("Unknown literals");
            }
    }
}
