"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReferenceObject = exports.typeToSchemaOrReferenceObject = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const types_1 = require("../../types");
function typeToSchemaOrReferenceObject(type, typeTable, nullable) {
    switch (type.kind) {
        case types_1.TypeKind.NULL:
            throw new Error("Null must be part of a union for OpenAPI 3");
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
exports.typeToSchemaOrReferenceObject = typeToSchemaOrReferenceObject;
function booleanSchema(opts = {}) {
    return {
        type: "boolean",
        enum: createEnum(opts.values, opts.nullable),
        nullable: opts.nullable || undefined
    };
}
function stringSchema(opts = {}) {
    return {
        type: "string",
        enum: createEnum(opts.values, opts.nullable),
        format: opts.format,
        nullable: opts.nullable || undefined
    };
}
function numberSchema(opts = {}) {
    return {
        type: "number",
        enum: createEnum(opts.values, opts.nullable),
        format: opts.format,
        nullable: opts.nullable || undefined
    };
}
function integerSchema(opts = {}) {
    return {
        type: "integer",
        enum: createEnum(opts.values, opts.nullable),
        format: opts.format,
        nullable: opts.nullable || undefined
    };
}
function objectTypeToSchema(type, typeTable, nullable) {
    const properties = type.properties.length > 0
        ? type.properties.reduce((acc, property) => {
            const propType = typeToSchemaOrReferenceObject(property.type, typeTable);
            if (!isReferenceObject(propType)) {
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
        nullable: nullable || undefined
    };
}
function arrayTypeToSchema(type, typeTable, nullable) {
    return {
        type: "array",
        items: typeToSchemaOrReferenceObject(type.elementType, typeTable),
        nullable: nullable || undefined
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
            throw new Error("Null must be part of a union for OpenAPI 3");
        case 1: // not an OpenAPI union, but a single type, possibly nullable
            return typeToSchemaOrReferenceObject(nonNullTypes[0], typeTable, nullable);
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
                return {
                    nullable: nullable || undefined,
                    oneOf: nonNullTypes.map(t => typeToSchemaOrReferenceObject(t, typeTable)),
                    discriminator: unionTypeToDiscrimintorObject(type, typeTable)
                };
            }
    }
}
function unionTypeToDiscrimintorObject(unionType, typeTable) {
    if (unionType.discriminator === undefined)
        return undefined;
    const nonNullTypes = unionType.types.filter(types_1.isNotNullType);
    // Discriminator mapping is only supported for reference types
    // however reference can even point to union or
    // intersection types. This ensures those also meet the
    // requirement
    const objectReferenceOnly = nonNullTypes.every(t => {
        return (types_1.isReferenceType(t) && types_1.possibleRootTypes(t, typeTable).every(types_1.isObjectType));
    });
    if (!objectReferenceOnly)
        return { propertyName: unionType.discriminator };
    const mapping = nonNullTypes.reduce((acc, t) => {
        // Sanity check and type cast
        if (!types_1.isReferenceType(t)) {
            throw new Error("Unexpected error: expected reference type");
        }
        const concreteTypes = types_1.possibleRootTypes(t, typeTable);
        // Sanity check and type cast
        if (!concreteTypes.every(types_1.isObjectType)) {
            throw new Error("Unexpected error: expected object reference type");
        }
        // Retrieve the discriminator property
        // Discriminator properties cannot be optional - we assume this is handled by the type parser
        // We first determine the object which contains the discriminator
        // followed by which we identify the prop itself.
        // This helps us identify discriminators even if one of the unions is an intersection or is
        // a union of unions
        const discriminatorObject = concreteTypes.find(object => {
            return object.properties.find(p => p.name === unionType.discriminator);
        });
        if (discriminatorObject === undefined) {
            throw new Error("Unexpected error: could not find expected discriminator property in objects");
        }
        const discriminatorProp = discriminatorObject.properties.find(p => p.name === unionType.discriminator);
        if (discriminatorProp === undefined) {
            throw new Error("Unexpected error: could not find expected discriminator property");
        }
        // Extract the property type - this is expected to be a string literal
        const discriminatorPropType = types_1.dereferenceType(discriminatorProp.type, typeTable);
        if (!types_1.isStringLiteralType(discriminatorPropType)) {
            throw new Error("Unexpected error: expected discriminator property type to be a string literal");
        }
        acc[discriminatorPropType.value] = referenceObjectValue(t.name);
        return acc;
    }, {});
    return {
        propertyName: unionType.discriminator,
        mapping
    };
}
function intersectionTypeToSchema(type, typeTable) {
    // Sanity check: This should not be possible
    if (type.types.length === 0) {
        throw new Error("Unexpected type: intersection type with no types");
    }
    const nullable = type.types.some(types_1.isNullType);
    const nonNullTypes = type.types.filter(types_1.isNotNullType);
    return {
        nullable: nullable || undefined,
        allOf: nonNullTypes.map((t) => typeToSchemaOrReferenceObject(t, typeTable))
    };
}
function referenceTypeToSchema(type, nullable) {
    return {
        $ref: referenceObjectValue(type.name),
        nullable: nullable || undefined
    };
}
function referenceObjectValue(referenceName) {
    return `#/components/schemas/${referenceName}`;
}
/**
 * Enum generation helper
 */
function createEnum(values, nullable) {
    if (!values)
        return;
    return nullable ? [...values, null] : values;
}
function isReferenceObject(typeObject) {
    return "$ref" in typeObject;
}
exports.isReferenceObject = isReferenceObject;
