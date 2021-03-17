"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryParams = void 0;
const errors_1 = require("../errors");
const http_1 = require("../http");
const util_1 = require("../util");
const parser_helpers_1 = require("./parser-helpers");
const type_parser_1 = require("./type-parser");
const example_parser_1 = require("./example-parser");
function parseQueryParams(parameter, typeTable, lociTable) {
    parameter.getDecoratorOrThrow("queryParams");
    if (parameter.hasQuestionToken()) {
        return util_1.err(new errors_1.OptionalNotAllowedError("@queryParams parameter cannot be optional", {
            file: parameter.getSourceFile().getFilePath(),
            position: parameter.getQuestionTokenNodeOrThrow().getPos()
        }));
    }
    const queryParamPropertySignatures = parser_helpers_1.getParameterPropertySignaturesOrThrow(parameter);
    const queryParams = [];
    for (const propertySignature of queryParamPropertySignatures) {
        const nameResult = extractQueryParamName(propertySignature);
        if (nameResult.isErr())
            return nameResult;
        const name = nameResult.unwrap();
        const typeResult = extractQueryParamType(propertySignature, typeTable, lociTable);
        if (typeResult.isErr())
            return typeResult;
        const type = typeResult.unwrap();
        const jsDocNode = parser_helpers_1.getJsDoc(propertySignature);
        const description = jsDocNode === null || jsDocNode === void 0 ? void 0 : jsDocNode.getDescription().trim();
        const examples = example_parser_1.extractJSDocExamples(jsDocNode, type);
        if (examples && examples.isErr())
            return examples;
        const optional = propertySignature.hasQuestionToken();
        queryParams.push({
            name,
            type,
            description,
            optional,
            examples: examples === null || examples === void 0 ? void 0 : examples.unwrap()
        });
    }
    // TODO: add loci information
    return util_1.ok(queryParams);
}
exports.parseQueryParams = parseQueryParams;
function extractQueryParamName(propertySignature) {
    const name = parser_helpers_1.getPropertyName(propertySignature);
    if (!/^[\w-]*$/.test(name)) {
        return util_1.err(new errors_1.ParserError("@queryParams property name may only contain alphanumeric, underscore and hyphen characters", {
            file: propertySignature.getSourceFile().getFilePath(),
            position: propertySignature.getPos()
        }));
    }
    if (name.length === 0) {
        return util_1.err(new errors_1.ParserError("@queryParams property name must not be empty", {
            file: propertySignature.getSourceFile().getFilePath(),
            position: propertySignature.getPos()
        }));
    }
    return util_1.ok(name);
}
function extractQueryParamType(propertySignature, typeTable, lociTable) {
    const typeResult = type_parser_1.parseType(propertySignature.getTypeNodeOrThrow(), typeTable, lociTable);
    if (typeResult.isErr())
        return typeResult;
    if (!http_1.isQueryParamTypeSafe(typeResult.unwrap(), typeTable)) {
        return util_1.err(new errors_1.ParserError("query parameter type may only be a URL-safe type, a single depth object of URL-safe types or an array of URL-safe types", {
            file: propertySignature.getSourceFile().getFilePath(),
            position: propertySignature.getPos()
        }));
    }
    return typeResult;
}
