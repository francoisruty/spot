"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHeaderToHeaderObject = exports.queryParamToQueryParameterObject = exports.requestHeaderToHeaderParameterObject = exports.pathParamToPathParameterObject = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const types_1 = require("../../types");
function pathParamToPathParameterObject(pathParam, typeTable) {
    const concreteType = types_1.dereferenceType(pathParam.type, typeTable);
    return {
        name: pathParam.name,
        in: "path",
        description: pathParam.description,
        required: true,
        ...(types_1.isArrayType(concreteType)
            ? pathParamArrayTypeToParameterArrayTypeObject(concreteType, typeTable)
            : basicTypeToParameterBasicTypeObject(concreteType))
    };
}
exports.pathParamToPathParameterObject = pathParamToPathParameterObject;
function requestHeaderToHeaderParameterObject(header, typeTable) {
    const concreteType = types_1.dereferenceType(header.type, typeTable);
    return {
        name: header.name,
        in: "header",
        description: header.description,
        required: !header.optional,
        ...(types_1.isArrayType(concreteType)
            ? headerArrayTypeToParameterArrayTypeObject(concreteType, typeTable)
            : basicTypeToParameterBasicTypeObject(concreteType))
    };
}
exports.requestHeaderToHeaderParameterObject = requestHeaderToHeaderParameterObject;
function queryParamToQueryParameterObject(queryParam, typeTable, config) {
    const concreteType = types_1.dereferenceType(queryParam.type, typeTable);
    return {
        name: queryParam.name,
        in: "query",
        description: queryParam.description,
        required: !queryParam.optional,
        ...(types_1.isArrayType(concreteType)
            ? queryParamArrayTypeToParameterArrayTypeObject(concreteType, typeTable, config)
            : basicTypeToParameterBasicTypeObject(concreteType))
    };
}
exports.queryParamToQueryParameterObject = queryParamToQueryParameterObject;
function responseHeaderToHeaderObject(header, typeTable) {
    // TODO: warn header optionality is ignored for header object
    return {
        description: header.description,
        ...typeToItemsObject(header.type, typeTable)
    };
}
exports.responseHeaderToHeaderObject = responseHeaderToHeaderObject;
function basicTypeToParameterBasicTypeObject(type) {
    switch (type.kind) {
        case types_1.TypeKind.NULL:
            throw new Error("Null is not supported for parameters in OpenAPI 2");
        case types_1.TypeKind.BOOLEAN:
            return booleanParameterObject();
        case types_1.TypeKind.BOOLEAN_LITERAL:
            return booleanParameterObject({ values: [type.value] });
        case types_1.TypeKind.STRING:
            return stringParameterObject();
        case types_1.TypeKind.STRING_LITERAL:
            return stringParameterObject({ values: [type.value] });
        case types_1.TypeKind.FLOAT:
            return numberParameterObject({ format: "float" });
        case types_1.TypeKind.DOUBLE:
            return numberParameterObject({ format: "double" });
        case types_1.TypeKind.FLOAT_LITERAL:
            return numberParameterObject({
                values: [type.value],
                format: "float"
            });
        case types_1.TypeKind.INT32:
            return integerParameterObject({ format: "int32" });
        case types_1.TypeKind.INT64:
            return integerParameterObject({ format: "int64" });
        case types_1.TypeKind.INT_LITERAL:
            return integerParameterObject({
                values: [type.value],
                format: "int32"
            });
        case types_1.TypeKind.DATE:
            return stringParameterObject({ format: "date" });
        case types_1.TypeKind.DATE_TIME:
            return stringParameterObject({ format: "date-time" });
        case types_1.TypeKind.OBJECT:
            throw new Error("Object is not supported for parameters in OpenAPI 2");
        case types_1.TypeKind.UNION:
            throw new Error("Unions are not supported for parameters in OpenAPI 2");
        case types_1.TypeKind.INTERSECTION:
            throw new Error("Intersections are not supported for parameters in OpenAPI 2");
        default:
            assert_never_1.default(type);
    }
}
function booleanParameterObject(opts = {}) {
    return {
        type: "boolean",
        enum: opts.values
    };
}
function stringParameterObject(opts = {}) {
    return {
        type: "string",
        enum: opts.values,
        format: opts.format
    };
}
function numberParameterObject(opts = {}) {
    return {
        type: "number",
        enum: opts.values,
        format: opts.format
    };
}
function integerParameterObject(opts = {}) {
    return {
        type: "integer",
        enum: opts.values,
        format: opts.format
    };
}
const pathParamArrayTypeToParameterArrayTypeObject = arrayTypeToParameterArrayTypeObject;
const headerArrayTypeToParameterArrayTypeObject = arrayTypeToParameterArrayTypeObject;
const queryParamArrayTypeToParameterArrayTypeObject = (type, typeTable, config) => arrayTypeToParameterArrayMultiTypeObject(type, typeTable, configToQueryParameterCollectionFormat(config));
function arrayTypeToParameterArrayTypeObject(type, typeTable, collectionFormat) {
    return {
        type: "array",
        collectionFormat,
        items: typeToItemsObject(type.elementType, typeTable)
    };
}
function arrayTypeToParameterArrayMultiTypeObject(type, typeTable, collectionFormat) {
    return {
        type: "array",
        collectionFormat,
        items: typeToItemsObject(type.elementType, typeTable)
    };
}
function typeToItemsObject(type, typeTable) {
    const concreteType = types_1.dereferenceType(type, typeTable);
    return types_1.isArrayType(concreteType)
        ? {
            type: "array",
            items: typeToItemsObject(concreteType.elementType, typeTable)
        }
        : basicTypeToParameterBasicTypeObject(concreteType);
}
function configToQueryParameterCollectionFormat(config) {
    switch (config.paramSerializationStrategy.query.array) {
        case "ampersand":
            return "multi";
        case "comma":
            return "csv";
        default:
            assert_never_1.default(config.paramSerializationStrategy.query.array);
    }
}
