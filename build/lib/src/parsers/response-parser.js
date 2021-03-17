"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponse = void 0;
const util_1 = require("../util");
const body_parser_1 = require("./body-parser");
const headers_parser_1 = require("./headers-parser");
const parser_helpers_1 = require("./parser-helpers");
function parseResponse(method, typeTable, lociTable) {
    var _a;
    const decorator = method.getDecoratorOrThrow("response");
    const decoratorConfig = parser_helpers_1.getDecoratorConfigOrThrow(decorator);
    const statusProp = parser_helpers_1.getObjLiteralPropOrThrow(decoratorConfig, "status");
    const statusLiteral = parser_helpers_1.getPropValueAsNumberOrThrow(statusProp);
    const headersParam = parser_helpers_1.getParamWithDecorator(method, "headers");
    const bodyParam = parser_helpers_1.getParamWithDecorator(method, "body");
    const headers = [];
    if (headersParam) {
        const headersResult = headers_parser_1.parseHeaders(headersParam, typeTable, lociTable);
        if (headersResult.isErr())
            return headersResult;
        headers.push(...headersResult.unwrap());
    }
    let body;
    if (bodyParam) {
        const bodyResult = body_parser_1.parseBody(bodyParam, typeTable, lociTable);
        if (bodyResult.isErr())
            return bodyResult;
        body = bodyResult.unwrap();
    }
    return util_1.ok({
        status: statusLiteral.getLiteralValue(),
        headers,
        description: (_a = parser_helpers_1.getJsDoc(method)) === null || _a === void 0 ? void 0 : _a.getDescription().trim(),
        body
    });
}
exports.parseResponse = parseResponse;
