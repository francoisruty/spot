"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePathParams = void 0;
const errors_1 = require("../errors");
const http_1 = require("../http");
const util_1 = require("../util");
const parser_helpers_1 = require("./parser-helpers");
const type_parser_1 = require("./type-parser");
const example_parser_1 = require("./example-parser");
function parsePathParams(parameter, typeTable, lociTable) {
    parameter.getDecoratorOrThrow("pathParams");
    if (parameter.hasQuestionToken()) {
        return util_1.err(new errors_1.OptionalNotAllowedError("@pathParams parameter cannot be optional", {
            file: parameter.getSourceFile().getFilePath(),
            position: parameter.getQuestionTokenNodeOrThrow().getPos()
        }));
    }
    const pathParamPropertySignatures = parser_helpers_1.getParameterPropertySignaturesOrThrow(parameter);
    const pathParams = [];
    for (const propertySignature of pathParamPropertySignatures) {
        const pathParamResult = extractPathParam(propertySignature, typeTable, lociTable);
        if (pathParamResult.isErr())
            return pathParamResult;
        pathParams.push(pathParamResult.unwrap());
    }
    return util_1.ok(pathParams);
}
exports.parsePathParams = parsePathParams;
function extractPathParam(propertySignature, typeTable, lociTable) {
    if (propertySignature.hasQuestionToken()) {
        return util_1.err(new errors_1.OptionalNotAllowedError("@pathParams property cannot be optional", {
            file: propertySignature.getSourceFile().getFilePath(),
            position: propertySignature.getQuestionTokenNodeOrThrow().getPos()
        }));
    }
    const nameResult = extractPathParamName(propertySignature);
    if (nameResult.isErr())
        return nameResult;
    const name = nameResult.unwrap();
    const typeResult = extractPathParamType(propertySignature, typeTable, lociTable);
    if (typeResult.isErr())
        return typeResult;
    const type = typeResult.unwrap();
    const jsDocNode = parser_helpers_1.getJsDoc(propertySignature);
    const description = jsDocNode === null || jsDocNode === void 0 ? void 0 : jsDocNode.getDescription().trim();
    const examples = example_parser_1.extractJSDocExamples(jsDocNode, type);
    if (examples && examples.isErr())
        return examples;
    return util_1.ok({
        name,
        type,
        description,
        examples: examples === null || examples === void 0 ? void 0 : examples.unwrap()
    });
}
function extractPathParamName(propertySignature) {
    const name = parser_helpers_1.getPropertyName(propertySignature);
    if (!/^[\w-]*$/.test(name)) {
        return util_1.err(new errors_1.ParserError("@pathParams property name may only contain alphanumeric, underscore and hyphen characters", {
            file: propertySignature.getSourceFile().getFilePath(),
            position: propertySignature.getPos()
        }));
    }
    if (name.length === 0) {
        return util_1.err(new errors_1.ParserError("@pathParams property name must not be empty", {
            file: propertySignature.getSourceFile().getFilePath(),
            position: propertySignature.getPos()
        }));
    }
    return util_1.ok(name);
}
function extractPathParamType(propertySignature, typeTable, lociTable) {
    const typeResult = type_parser_1.parseType(propertySignature.getTypeNodeOrThrow(), typeTable, lociTable);
    if (typeResult.isErr())
        return typeResult;
    if (!http_1.isPathParamTypeSafe(typeResult.unwrap(), typeTable)) {
        return util_1.err(new errors_1.ParserError("path parameter type may only be a URL-safe type, or an array of URL-safe types", {
            file: propertySignature.getSourceFile().getFilePath(),
            position: propertySignature.getPos()
        }));
    }
    return typeResult;
}
