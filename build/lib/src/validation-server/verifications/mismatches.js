"use strict";
/**
 * Mismatches are used by the contract mismatcher to report on mismatches
 * between data and different components of a contract. They are not intended
 * to produce human friendly messages as they may not contain a sufficient
 * amount of contextual information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyTypeDisparityMismatch = exports.undefinedBodyMismatch = exports.queryParamTypeDisparityMismatch = exports.undefinedQueryParamMismatch = exports.requiredQueryParamMissingMismatch = exports.pathParamTypeDisparityMismatch = exports.headerTypeDisparityMismatch = exports.undefinedHeaderMismatch = exports.requiredHeaderMissingMismatch = exports.MismatchKind = void 0;
var MismatchKind;
(function (MismatchKind) {
    MismatchKind["REQUIRED_HEADER_MISSING"] = "required_header_missing";
    MismatchKind["UNDEFINED_HEADER"] = "undefined_header";
    MismatchKind["HEADER_TYPE_DISPARITY"] = "header_type_disparity";
    MismatchKind["PATH_PARAM_TYPE_DISPARITY"] = "path_param_type_disparity";
    MismatchKind["REQUIRED_QUERY_PARAM_MISSING"] = "required_query_param_missing";
    MismatchKind["UNDEFINED_QUERY_PARAM"] = "undefined_query_param";
    MismatchKind["QUERY_PARAM_TYPE_DISPARITY"] = "query_param_type_disparity";
    MismatchKind["UNDEFINED_BODY"] = "undefined_body";
    MismatchKind["BODY_TYPE_DISPARITY"] = "body_type_disparity";
})(MismatchKind = exports.MismatchKind || (exports.MismatchKind = {}));
function requiredHeaderMissingMismatch(header) {
    return { kind: MismatchKind.REQUIRED_HEADER_MISSING, header };
}
exports.requiredHeaderMissingMismatch = requiredHeaderMissingMismatch;
function undefinedHeaderMismatch(header) {
    return { kind: MismatchKind.UNDEFINED_HEADER, header };
}
exports.undefinedHeaderMismatch = undefinedHeaderMismatch;
function headerTypeDisparityMismatch(header, typeDisparities) {
    return {
        kind: MismatchKind.HEADER_TYPE_DISPARITY,
        header,
        typeDisparities
    };
}
exports.headerTypeDisparityMismatch = headerTypeDisparityMismatch;
function pathParamTypeDisparityMismatch(pathParam, typeDisparities) {
    return {
        kind: MismatchKind.PATH_PARAM_TYPE_DISPARITY,
        pathParam,
        typeDisparities
    };
}
exports.pathParamTypeDisparityMismatch = pathParamTypeDisparityMismatch;
function requiredQueryParamMissingMismatch(queryParam) {
    return { kind: MismatchKind.REQUIRED_QUERY_PARAM_MISSING, queryParam };
}
exports.requiredQueryParamMissingMismatch = requiredQueryParamMissingMismatch;
function undefinedQueryParamMismatch(queryParam) {
    return { kind: MismatchKind.UNDEFINED_QUERY_PARAM, queryParam };
}
exports.undefinedQueryParamMismatch = undefinedQueryParamMismatch;
function queryParamTypeDisparityMismatch(queryParam, typeDisparities) {
    return {
        kind: MismatchKind.QUERY_PARAM_TYPE_DISPARITY,
        queryParam,
        typeDisparities
    };
}
exports.queryParamTypeDisparityMismatch = queryParamTypeDisparityMismatch;
function undefinedBodyMismatch() {
    return { kind: MismatchKind.UNDEFINED_BODY };
}
exports.undefinedBodyMismatch = undefinedBodyMismatch;
function bodyTypeDisparityMismatch(data, typeDisparities) {
    return {
        kind: MismatchKind.BODY_TYPE_DISPARITY,
        data,
        typeDisparities
    };
}
exports.bodyTypeDisparityMismatch = bodyTypeDisparityMismatch;
