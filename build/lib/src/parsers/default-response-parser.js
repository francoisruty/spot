"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDefaultResponse = void 0;
const util_1 = require("../util");
const body_parser_1 = require("./body-parser");
const headers_parser_1 = require("./headers-parser");
const parser_helpers_1 = require("./parser-helpers");
function parseDefaultResponse(method, typeTable, lociTable) {
    var _a;
    method.getDecoratorOrThrow("defaultResponse");
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
        headers,
        description: (_a = parser_helpers_1.getJsDoc(method)) === null || _a === void 0 ? void 0 : _a.getDescription().trim(),
        body
    });
}
exports.parseDefaultResponse = parseDefaultResponse;
