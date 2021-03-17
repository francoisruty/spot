"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRequest = void 0;
const util_1 = require("../util");
const body_parser_1 = require("./body-parser");
const headers_parser_1 = require("./headers-parser");
const parser_helpers_1 = require("./parser-helpers");
const path_params_parser_1 = require("./path-params-parser");
const query_params_parser_1 = require("./query-params-parser");
function parseRequest(method, typeTable, lociTable) {
    method.getDecoratorOrThrow("request");
    const headersParam = parser_helpers_1.getParamWithDecorator(method, "headers");
    const pathParamsParam = parser_helpers_1.getParamWithDecorator(method, "pathParams");
    const queryParamsParam = parser_helpers_1.getParamWithDecorator(method, "queryParams");
    const bodyParam = parser_helpers_1.getParamWithDecorator(method, "body");
    const headers = [];
    if (headersParam) {
        const headersResult = headers_parser_1.parseHeaders(headersParam, typeTable, lociTable);
        if (headersResult.isErr())
            return headersResult;
        headers.push(...headersResult.unwrap());
    }
    const pathParams = [];
    if (pathParamsParam) {
        const pathParamsResult = path_params_parser_1.parsePathParams(pathParamsParam, typeTable, lociTable);
        if (pathParamsResult.isErr())
            return pathParamsResult;
        pathParams.push(...pathParamsResult.unwrap());
    }
    const queryParams = [];
    if (queryParamsParam) {
        const queryParamsResult = query_params_parser_1.parseQueryParams(queryParamsParam, typeTable, lociTable);
        if (queryParamsResult.isErr())
            return queryParamsResult;
        queryParams.push(...queryParamsResult.unwrap());
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
        pathParams,
        queryParams,
        body
    });
}
exports.parseRequest = parseRequest;
