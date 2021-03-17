"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReferenceSchemaObject = exports.typeToSchemaObject = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const types_1 = require("../../types");
function typeToSchemaObject(type, typeTable, nullable) {
    switch (type.kind) {
        case types_1.TypeKind.NULL:
            throw new Error("Null must be part of a union for OpenAPI 2");
        case types_1.TypeKind.BOOLEAN:
            return booleanSchema({ nullable });
        case types_1.TypeKind.BOOLEAN_LITERAL:
            return booleanSchema({ values: [type.value], nullable });
        case types_1.TypeKind.STRING:
            return stringSchema({ nullable });
        case types_1.TypeKind.STRING_LITERAL:
            return stringSchema({ values: [type.value], nullable });
        case types_1.TypeKind.FLOAT:
            return numberSchema({ format: "float", nullable });
        case types_1.TypeKind.DOUBLE:
            return numberSchema({ format: "double", nullable });
        case types_1.TypeKind.FLOAT_LITERAL:
            return numberSchema({ values: [type.value], format: "float", nullable });
        case types_1.TypeKind.INT32:
            return integerSchema({ format: "int32", nullable });
        case types_1.TypeKind.INT64:
            return integerSchema({ format: "int64", nullable });
        case types_1.TypeKind.INT_LITERAL:
            return integerSchema({ values: [type.value], format: "int32", nullable });
        case types_1.TypeKind.DATE:
            return stringSchema({ format: "date", nullable });
        case types_1.TypeKind.DATE_TIME:
            return stringSchema({ format: "date-time", nullable });
        case types_1.TypeKind.OBJECT:
            return objectTypeToSchema(type, typeTable, nullable);
        case types_1.TypeKind.ARRAY:
            return arrayTypeToSchema(type, typeTable, nullable);
        case types_1.TypeKind.UNION:
            return unionTypeToSchema(type, typeTable);
        case types_1.TypeKind.INTERSECTION:
            return intersectionTypeToSchema(type, typeTable);
        case types_1.TypeKind.REFERENCE:
            return referenceTypeToSchema(type, nullable);
        default:
            assert_never_1.default(type);
    }
}
exports.typeToSchemaObject = typeToSchemaObject;
function booleanSchema(opts = {}) {
    return {
        type: "boolean",
        enum: createEnum(opts.values, opts.nullable),
        "x-nullable": opts.nullable || undefined
    };
}
function stringSchema(opts = {}) {
    return {
        type: "string",
        enum: createEnum(opts.values, opts.nullable),
        format: opts.format,
        "x-nullable": opts.nullable || undefined
    };
}
function numberSchema(opts = {}) {
    return {
        type: "number",
        enum: createEnum(opts.values, opts.nullable),
        format: opts.format,
        "x-nullable": opts.nullable || undefined
    };
}
function integerSchema(opts = {}) {
    return {
        type: "integer",
        enum: createEnum(opts.values, opts.nullable),
        format: opts.format,
        "x-nullable": opts.nullable || undefined
    };
}
function objectTypeToSchema(type, typeTable, nullable) {
    const properties = type.properties.length > 0
        ? type.properties.reduce((acc, property) => {
            const propType = typeToSchemaObject(property.type, typeTable);
            if (!isReferenceSchemaObject(propType)) {
                propType.description = property.description;
            }
            acc[property.name] = propType;
            return acc;
        }, {})
        : undefined;
    const requiredProperties = type.properties
        .filter(p => !p.optional)
        .map(p => p.name);
    const required = requiredProperties.length > 0 ? requiredProperties : undefined;
    return {
        type: "object",
        properties,
        required,
        "x-nullable": nullable || undefined
    };
}
function arrayTypeToSchema(type, typeTable, nullable) {
    return {
        type: "array",
        items: typeToSchemaObject(type.elementType, typeTable),
        "x-nullable": nullable || undefined
    };
}
/**
 * Unions are NOT flattened
 */
function unionTypeToSchema(type, typeTable) {
    // Sanity check
    if (type.types.length === 0) {
        throw new Error("Unexpected type: union with no types");
    }
    const nullable = type.types.some(types_1.isNullType);
    const nonNullTypes = type.types.filter(types_1.isNotNullType);
    switch (nonNullTypes.length) {
        case 0: // previous guard guarantees only null was present
            throw new Error("Null must be part of a union for OpenAPI 2");
        case 1: // not an OpenAPI union, but a single type, possibly nullable
            return typeToSchemaObject(nonNullTypes[0], typeTable, nullable);
        default:
            if (types_1.areBooleanLiteralTypes(nonNullTypes)) {
                return booleanSchema({
                    values: nonNullTypes.map(t => t.value),
                    nullable
                });
            }
            else if (types_1.areStringLiteralTypes(nonNullTypes)) {
                return stringSchema({
                    values: nonNullTypes.map(t => t.value),
                    nullable
                });
            }
            else if (types_1.areFloatLiteralTypes(nonNullTypes)) {
                return numberSchema({
                    values: nonNullTypes.map(t => t.value),
                    format: "float",
                    nullable
                });
            }
            else if (types_1.areIntLiteralTypes(nonNullTypes)) {
                return integerSchema({
                    values: nonNullTypes.map(t => t.value),
                    format: "int32",
                    nullable
                });
            }
            else {
                // See https://github.com/OAI/OpenAPI-Specification/issues/333
                throw new Error(`Unions are not supported in OpenAPI 2`);
            }
    }
}
function intersectionTypeToSchema(type, typeTable) {
    // Sanity check: This should not be possible
    if (type.types.length === 0) {
        throw new Error("Unexpected type: intersection type with no types");
    }
    const nonNullTypes = type.types.filter(types_1.isNotNullType);
    return {
        allOf: nonNullTypes.map((t) => typeToSchemaObject(t, typeTable))
    };
}
function referenceTypeToSchema(type, nullable) {
    if (nullable) {
        return {
            "x-nullable": true,
            allOf: [{ $ref: referenceObjectValue(type.name) }]
        };
    }
    else {
        return { $ref: referenceObjectValue(type.name) };
    }
}
function referenceObjectValue(referenceName) {
    return `#/definitions/${referenceName}`;
}
/**
 * Enum generation helper
 */
function createEnum(values, nullable) {
    if (!values)
        return;
    return nullable ? [...values, null] : values;
}
function isReferenceSchemaObject(typeObject) {
    return "$ref" in typeObject;
}
exports.isReferenceSchemaObject = isReferenceSchemaObject;
