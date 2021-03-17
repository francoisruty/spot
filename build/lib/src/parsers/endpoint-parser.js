"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEndpoint = void 0;
const ts_morph_1 = require("ts-morph");
const errors_1 = require("../errors");
const locations_1 = require("../locations");
const util_1 = require("../util");
const default_response_parser_1 = require("./default-response-parser");
const parser_helpers_1 = require("./parser-helpers");
const request_parser_1 = require("./request-parser");
const response_parser_1 = require("./response-parser");
function parseEndpoint(klass, typeTable, lociTable) {
    var _a, _b;
    const decorator = klass.getDecoratorOrThrow("endpoint");
    const decoratorConfig = parser_helpers_1.getDecoratorConfigOrThrow(decorator);
    // Handle name
    const name = klass.getNameOrThrow();
    // Handle method
    const methodProp = parser_helpers_1.getObjLiteralPropOrThrow(decoratorConfig, "method");
    const methodLiteral = parser_helpers_1.getPropValueAsStringOrThrow(methodProp);
    const method = methodLiteral.getLiteralText();
    if (!parser_helpers_1.isHttpMethod(method)) {
        throw new Error(`expected a HttpMethod, got ${method}`);
    }
    // Handle tags
    const tagsResult = extractEndpointTags(decoratorConfig);
    if (tagsResult.isErr())
        return tagsResult;
    const tags = tagsResult.unwrap();
    // Handle jsdoc
    const description = (_a = parser_helpers_1.getJsDoc(klass)) === null || _a === void 0 ? void 0 : _a.getDescription().trim();
    // Handle draft
    const draft = klass.getDecorator("draft") !== undefined;
    // Handle request
    const requestMethod = parser_helpers_1.getMethodWithDecorator(klass, "request");
    const requestResult = requestMethod
        ? request_parser_1.parseRequest(requestMethod, typeTable, lociTable)
        : util_1.ok(undefined);
    if (requestResult.isErr())
        return requestResult;
    const request = requestResult.unwrap();
    // Handle responses
    const responsesResult = extractEndpointResponses(klass, typeTable, lociTable);
    if (responsesResult.isErr())
        return responsesResult;
    const responses = responsesResult.unwrap();
    // Handle default response
    const defaultResponseMethod = parser_helpers_1.getMethodWithDecorator(klass, "defaultResponse");
    const defaultResponseResult = defaultResponseMethod
        ? default_response_parser_1.parseDefaultResponse(defaultResponseMethod, typeTable, lociTable)
        : util_1.ok(undefined);
    if (defaultResponseResult.isErr())
        return defaultResponseResult;
    const defaultResponse = defaultResponseResult.unwrap();
    // Handle path
    const pathResult = extractEndpointPath(decoratorConfig);
    if (pathResult.isErr())
        return pathResult;
    const path = pathResult.unwrap();
    // Check request path params cover the path dynamic components
    const pathParamsInPath = getDynamicPathComponents(path);
    const pathParamsInRequest = (_b = request === null || request === void 0 ? void 0 : request.pathParams.map(pathParam => pathParam.name)) !== null && _b !== void 0 ? _b : [];
    const exclusivePathParamsInPath = pathParamsInPath.filter(pathParam => !pathParamsInRequest.includes(pathParam));
    const exclusivePathParamsInRequest = pathParamsInRequest.filter(pathParam => !pathParamsInPath.includes(pathParam));
    if (exclusivePathParamsInPath.length !== 0) {
        return util_1.err(new errors_1.ParserError(`endpoint path dynamic components must have a corresponding path param defined in @request. Violating path components: ${exclusivePathParamsInPath.join(", ")}`, {
            file: klass.getSourceFile().getFilePath(),
            position: klass.getPos()
        }));
    }
    if (exclusivePathParamsInRequest.length !== 0) {
        return util_1.err(new errors_1.ParserError(`endpoint request path params must have a corresponding dynamic path component defined in @endpoint. Violating path params: ${exclusivePathParamsInRequest.join(", ")}`, {
            file: klass.getSourceFile().getFilePath(),
            position: klass.getPos()
        }));
    }
    // Add location data
    lociTable.addMorphNode(locations_1.LociTable.endpointClassKey(name), klass);
    lociTable.addMorphNode(locations_1.LociTable.endpointDecoratorKey(name), decorator);
    lociTable.addMorphNode(locations_1.LociTable.endpointMethodKey(name), methodProp);
    return util_1.ok({
        name,
        description,
        tags,
        method,
        path,
        request,
        responses,
        defaultResponse,
        draft
    });
}
exports.parseEndpoint = parseEndpoint;
function extractEndpointTags(decoratorConfig) {
    const tagsProp = parser_helpers_1.getObjLiteralProp(decoratorConfig, "tags");
    if (tagsProp === undefined)
        return util_1.ok([]);
    const tagsLiteral = parser_helpers_1.getPropValueAsArrayOrThrow(tagsProp);
    const tags = [];
    for (const elementExpr of tagsLiteral.getElements()) {
        // Sanity check, typesafety should prevent any non-string tags
        if (!ts_morph_1.TypeGuards.isStringLiteral(elementExpr)) {
            return util_1.err(new errors_1.ParserError("endpoint tag must be a string", {
                file: elementExpr.getSourceFile().getFilePath(),
                position: elementExpr.getPos()
            }));
        }
        const tag = elementExpr.getLiteralText().trim();
        if (tag.length === 0) {
            return util_1.err(new errors_1.ParserError("endpoint tag cannot be blank", {
                file: elementExpr.getSourceFile().getFilePath(),
                position: elementExpr.getPos()
            }));
        }
        if (!/^[\w\s-]*$/.test(tag)) {
            return util_1.err(new errors_1.ParserError("endpoint tag may only contain alphanumeric, space, underscore and hyphen characters", {
                file: elementExpr.getSourceFile().getFilePath(),
                position: elementExpr.getPos()
            }));
        }
        tags.push(tag);
    }
    const duplicateTags = [
        ...new Set(tags.filter((tag, index) => tags.indexOf(tag) !== index))
    ];
    if (duplicateTags.length !== 0) {
        return util_1.err(new errors_1.ParserError(`endpoint tags may not contain duplicates: ${duplicateTags.join(", ")}`, {
            file: tagsProp.getSourceFile().getFilePath(),
            position: tagsProp.getPos()
        }));
    }
    return util_1.ok(tags.sort((a, b) => (b > a ? -1 : 1)));
}
function extractEndpointPath(decoratorConfig) {
    const pathProp = parser_helpers_1.getObjLiteralPropOrThrow(decoratorConfig, "path");
    const pathLiteral = parser_helpers_1.getPropValueAsStringOrThrow(pathProp);
    const path = pathLiteral.getLiteralText();
    const dynamicComponents = getDynamicPathComponents(path);
    const duplicateDynamicComponents = [
        ...new Set(dynamicComponents.filter((component, index) => dynamicComponents.indexOf(component) !== index))
    ];
    if (duplicateDynamicComponents.length !== 0) {
        return util_1.err(new errors_1.ParserError("endpoint path dynamic components must have unique names", {
            file: pathProp.getSourceFile().getFilePath(),
            position: pathProp.getPos()
        }));
    }
    return util_1.ok(path);
}
function extractEndpointResponses(klass, typeTable, lociTable) {
    const responseMethods = klass
        .getMethods()
        .filter(m => m.getDecorator("response") !== undefined);
    const responses = [];
    for (const method of responseMethods) {
        const responseResult = response_parser_1.parseResponse(method, typeTable, lociTable);
        if (responseResult.isErr())
            return responseResult;
        responses.push(responseResult.unwrap());
    }
    // ensure unique response statsues
    const statuses = responses.map(r => r.status);
    const duplicateStatuses = [
        ...new Set(statuses.filter((status, index) => statuses.indexOf(status) !== index))
    ];
    if (duplicateStatuses.length !== 0) {
        return util_1.err(new errors_1.ParserError(`endpoint responses must have unique statuses. Duplicates found: ${duplicateStatuses.join(", ")}`, { file: klass.getSourceFile().getFilePath(), position: klass.getPos() }));
    }
    return util_1.ok(responses.sort((a, b) => (b.status > a.status ? -1 : 1)));
}
function getDynamicPathComponents(path) {
    return path
        .split("/")
        .filter(component => component.startsWith(":"))
        .map(component => component.substr(1));
}
