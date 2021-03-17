"use strict";
/**
 * Violations are used as part of the validation server payload to
 * express contract violations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseBodyTypeDisparityViolation = exports.undefinedResponseBodyViolation = exports.responseHeaderTypeDisparityViolation = exports.undefinedResponseHeaderViolation = exports.requiredResponseHeaderMissingViolation = exports.requestBodyTypeDisparityViolation = exports.undefinedRequestBodyViolation = exports.queryParamTypeDisparityViolation = exports.undefinedQueryParamViolation = exports.requiredQueryParamMissingViolation = exports.pathParamTypeDisparityViolation = exports.requestHeaderTypeDisparityViolation = exports.undefinedRequestHeaderViolation = exports.requiredRequestHeaderMissingViolation = exports.undefinedEndpointResponseViolation = exports.undefinedEndpointViolation = void 0;
function undefinedEndpointViolation(message) {
    return { type: "undefined_endpoint", message };
}
exports.undefinedEndpointViolation = undefinedEndpointViolation;
function undefinedEndpointResponseViolation(message) {
    return { type: "undefined_endpoint_response", message };
}
exports.undefinedEndpointResponseViolation = undefinedEndpointResponseViolation;
function requiredRequestHeaderMissingViolation(message) {
    return { type: "required_request_header_missing", message };
}
exports.requiredRequestHeaderMissingViolation = requiredRequestHeaderMissingViolation;
function undefinedRequestHeaderViolation(message) {
    return { type: "undefined_request_header", message };
}
exports.undefinedRequestHeaderViolation = undefinedRequestHeaderViolation;
function requestHeaderTypeDisparityViolation(message, typeDisparities) {
    return {
        type: "request_header_type_disparity",
        message,
        type_disparities: typeDisparities
    };
}
exports.requestHeaderTypeDisparityViolation = requestHeaderTypeDisparityViolation;
function pathParamTypeDisparityViolation(message, typeDisparities) {
    return {
        type: "path_param_type_disparity",
        message,
        type_disparities: typeDisparities
    };
}
exports.pathParamTypeDisparityViolation = pathParamTypeDisparityViolation;
function requiredQueryParamMissingViolation(message) {
    return { type: "required_query_param_missing", message };
}
exports.requiredQueryParamMissingViolation = requiredQueryParamMissingViolation;
function undefinedQueryParamViolation(message) {
    return { type: "undefined_query_param", message };
}
exports.undefinedQueryParamViolation = undefinedQueryParamViolation;
function queryParamTypeDisparityViolation(message, typeDisparities) {
    return {
        type: "query_param_type_disparity",
        message,
        type_disparities: typeDisparities
    };
}
exports.queryParamTypeDisparityViolation = queryParamTypeDisparityViolation;
function undefinedRequestBodyViolation(message) {
    return { type: "undefined_request_body", message };
}
exports.undefinedRequestBodyViolation = undefinedRequestBodyViolation;
function requestBodyTypeDisparityViolation(message, typeDisparities) {
    return {
        type: "request_body_type_disparity",
        message,
        type_disparities: typeDisparities
    };
}
exports.requestBodyTypeDisparityViolation = requestBodyTypeDisparityViolation;
function requiredResponseHeaderMissingViolation(message) {
    return { type: "required_response_header_missing", message };
}
exports.requiredResponseHeaderMissingViolation = requiredResponseHeaderMissingViolation;
function undefinedResponseHeaderViolation(message) {
    return { type: "undefined_response_header", message };
}
exports.undefinedResponseHeaderViolation = undefinedResponseHeaderViolation;
function responseHeaderTypeDisparityViolation(message, typeDisparities) {
    return {
        type: "response_header_type_disparity",
        message,
        type_disparities: typeDisparities
    };
}
exports.responseHeaderTypeDisparityViolation = responseHeaderTypeDisparityViolation;
function undefinedResponseBodyViolation(message) {
    return { type: "undefined_response_body", message };
}
exports.undefinedResponseBodyViolation = undefinedResponseBodyViolation;
function responseBodyTypeDisparityViolation(message, typeDisparities) {
    return {
        type: "response_body_type_disparity",
        message,
        type_disparities: typeDisparities
    };
}
exports.responseBodyTypeDisparityViolation = responseBodyTypeDisparityViolation;
