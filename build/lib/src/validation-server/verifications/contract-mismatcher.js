"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathMatchesVariablePath = exports.ContractMismatcher = void 0;
const ajv_1 = __importDefault(require("ajv"));
const assert_never_1 = __importDefault(require("assert-never"));
const qs_1 = __importDefault(require("qs"));
const url = __importStar(require("url"));
const json_schema_type_util_1 = require("../../generators/json-schema/json-schema-type-util");
const types_1 = require("../../types");
const mismatches_1 = require("./mismatches");
const string_validator_1 = require("./string-validator");
const violations_1 = require("./violations");
class ContractMismatcher {
    constructor(contract) {
        this.contract = contract;
        this.typeTable = types_1.TypeTable.fromArray(this.contract.types);
    }
    findViolations(userInputRequest, userInputResponse) {
        var _a;
        const violations = [];
        // Get endpoint
        // Return violation if endpoint does not exist on the contract
        const expectedEndpoint = this.getEndpointByRequest(userInputRequest);
        if (!expectedEndpoint) {
            return {
                violations: [
                    violations_1.undefinedEndpointViolation(`Endpoint ${userInputRequest.method} ${userInputRequest.path} not found.`)
                ],
                context: { endpoint: "" }
            };
        }
        // Get request
        const expectedRequest = expectedEndpoint.request;
        // Get response
        // Return violation if endpoint response does not exist on the contract
        const expectedResponse = this.getRelevantResponse(expectedEndpoint, userInputResponse.statusCode);
        if (!expectedResponse) {
            return {
                violations: [
                    violations_1.undefinedEndpointResponseViolation(`There is no response or default response defined on ${expectedEndpoint.path}:${expectedEndpoint.method}`)
                ],
                context: { endpoint: expectedEndpoint.name }
            };
        }
        // Find request header mismatches
        const requestHeaderMismatches = this.findHeaderMismatches((_a = expectedRequest === null || expectedRequest === void 0 ? void 0 : expectedRequest.headers) !== null && _a !== void 0 ? _a : [], userInputRequest.headers, true);
        requestHeaderMismatches.forEach(m => {
            switch (m.kind) {
                case mismatches_1.MismatchKind.REQUIRED_HEADER_MISSING:
                    violations.push(violations_1.requiredRequestHeaderMissingViolation(`Required request header "${m.header}" missing`));
                    return;
                case mismatches_1.MismatchKind.UNDEFINED_HEADER:
                    violations.push(violations_1.undefinedRequestHeaderViolation(`Request header "${m.header}" not defined in contract request headers`));
                    return;
                case mismatches_1.MismatchKind.HEADER_TYPE_DISPARITY:
                    violations.push(violations_1.requestHeaderTypeDisparityViolation(`Request header "${m.header}" type disparity: ${m.typeDisparities.join(", ")}`, m.typeDisparities));
                    return;
                default:
                    assert_never_1.default(m);
            }
        });
        // Find response header mismatches
        const responseHeaderMismatches = this.findHeaderMismatches(expectedResponse.headers, userInputResponse.headers);
        responseHeaderMismatches.forEach(m => {
            switch (m.kind) {
                case mismatches_1.MismatchKind.REQUIRED_HEADER_MISSING:
                    violations.push(violations_1.requiredResponseHeaderMissingViolation(`Required response header "${m.header}" missing`));
                    return;
                case mismatches_1.MismatchKind.UNDEFINED_HEADER:
                    violations.push(violations_1.undefinedResponseHeaderViolation(`Response header "${m.header}" not defined in contract response headers`));
                    return;
                case mismatches_1.MismatchKind.HEADER_TYPE_DISPARITY:
                    violations.push(violations_1.responseHeaderTypeDisparityViolation(`Response header "${m.header}" type disparity: ${m.typeDisparities.join(", ")}`, m.typeDisparities));
                    return;
                default:
                    assert_never_1.default(m);
            }
        });
        // Find request body mismatches
        const requestBodyMismatches = this.findBodyMismatches(expectedRequest === null || expectedRequest === void 0 ? void 0 : expectedRequest.body, userInputRequest.body, true);
        requestBodyMismatches.forEach(m => {
            switch (m.kind) {
                case mismatches_1.MismatchKind.UNDEFINED_BODY:
                    violations.push(violations_1.undefinedRequestBodyViolation("Request body not defined in contract"));
                    return;
                case mismatches_1.MismatchKind.BODY_TYPE_DISPARITY:
                    violations.push(violations_1.requestBodyTypeDisparityViolation(`Request body type disparity:\n${m.data}\n${m.typeDisparities
                        .map(disp => `- ${disp}`)
                        .join("\n")}`, m.typeDisparities));
                    return;
                default:
                    assert_never_1.default(m);
            }
        });
        // Find response body mismatches
        const responseBodyMismatches = this.findBodyMismatches(expectedResponse.body, userInputResponse.body);
        responseBodyMismatches.forEach(m => {
            switch (m.kind) {
                case mismatches_1.MismatchKind.UNDEFINED_BODY:
                    violations.push(violations_1.undefinedResponseBodyViolation("Response body not defined in contract"));
                    return;
                case mismatches_1.MismatchKind.BODY_TYPE_DISPARITY:
                    violations.push(violations_1.responseBodyTypeDisparityViolation(`Response body type disparity:\n${m.data}\n${m.typeDisparities.map(disp => `- ${disp}`).join("\n")}`, m.typeDisparities));
                    return;
                default:
                    assert_never_1.default(m);
            }
        });
        // Find path parameter mismatches
        const pathParamMismatches = this.findPathParamMismatches(expectedEndpoint, userInputRequest.path);
        pathParamMismatches.forEach(m => {
            switch (m.kind) {
                case mismatches_1.MismatchKind.PATH_PARAM_TYPE_DISPARITY:
                    violations.push(violations_1.pathParamTypeDisparityViolation(`Path param "${m.pathParam}" type disparity: ${m.typeDisparities.join(", ")}`, m.typeDisparities));
                    return;
                default:
                    assert_never_1.default(m.kind);
            }
        });
        // Find query parameter mismatches
        const queryParamMismatches = this.findQueryParamMismatches(expectedEndpoint, userInputRequest.path);
        queryParamMismatches.forEach(m => {
            switch (m.kind) {
                case mismatches_1.MismatchKind.REQUIRED_QUERY_PARAM_MISSING:
                    violations.push(violations_1.requiredQueryParamMissingViolation(`Required query param "${m.queryParam}" missing`));
                    return;
                case mismatches_1.MismatchKind.UNDEFINED_QUERY_PARAM:
                    violations.push(violations_1.undefinedQueryParamViolation(`Query param "${m.queryParam}" not defined in contract request query params`));
                    return;
                case mismatches_1.MismatchKind.QUERY_PARAM_TYPE_DISPARITY:
                    violations.push(violations_1.queryParamTypeDisparityViolation(`Query param "${m.queryParam}" type disparity: ${m.typeDisparities.join(", ")}`, m.typeDisparities));
                    return;
                default:
                    assert_never_1.default(m);
            }
        });
        return { violations, context: { endpoint: expectedEndpoint.name } };
    }
    findHeaderMismatches(contractHeaders, inputHeaders, strict = false) {
        const mismatches = [];
        for (const header of contractHeaders) {
            const inputHeader = inputHeaders.find(iH => iH.name.toLowerCase() === header.name.toLowerCase());
            if (inputHeader === undefined) {
                if (!header.optional) {
                    mismatches.push(mismatches_1.requiredHeaderMissingMismatch(header.name));
                }
                continue;
            }
            const typeMismatches = this.findMismatchOnStringContent({ name: inputHeader.name, value: inputHeader.value }, header.type);
            if (typeMismatches.length > 0) {
                mismatches.push(mismatches_1.headerTypeDisparityMismatch(header.name, typeMismatches));
            }
        }
        if (strict) {
            inputHeaders
                .filter(iH => !contractHeaders.some(header => header.name.toLowerCase() === iH.name.toLowerCase()))
                .forEach(iH => {
                mismatches.push(mismatches_1.undefinedHeaderMismatch(iH.name));
            });
        }
        return mismatches;
    }
    findPathParamMismatches(contractEndpoint, inputPath) {
        var _a, _b;
        const contractPathParams = (_b = (_a = contractEndpoint.request) === null || _a === void 0 ? void 0 : _a.pathParams) !== null && _b !== void 0 ? _b : [];
        const contractPathArray = contractEndpoint.path.split("/");
        const inputPathArray = inputPath.split("?")[0].split("/");
        // Sanity check, this should never happen if called after ensuring the input path matches the correct endpoint
        if (contractPathArray.length !== inputPathArray.length) {
            throw new Error(`Unexpected error: endpoint path (${contractEndpoint.path}) does not match input path (${inputPath})`);
        }
        const mismatches = [];
        for (let i = 0; i < contractPathArray.length; i++) {
            if (contractPathArray[i].startsWith(":")) {
                const contractPathParam = contractPathParams.find(param => param.name === contractPathArray[i].substr(1));
                if (!contractPathParam) {
                    throw new Error("Unexpected error: could not find path param on contract.");
                }
                const contractPathParamType = contractPathParam.type;
                const pathParamMismatches = this.findMismatchOnStringContent({ name: contractPathParam.name, value: inputPathArray[i] }, contractPathParamType);
                if (pathParamMismatches.length > 0) {
                    mismatches.push(mismatches_1.pathParamTypeDisparityMismatch(contractPathParam.name, pathParamMismatches));
                }
            }
        }
        return mismatches;
    }
    findBodyMismatches(contractBody, inputBody, strict = false) {
        if (contractBody === undefined) {
            if (inputBody === undefined) {
                return [];
            }
            if (strict) {
                return [mismatches_1.undefinedBodyMismatch()];
            }
            return [];
        }
        const jsv = new ajv_1.default({
            format: "full",
            verbose: true,
            allErrors: true
        });
        const schema = {
            ...json_schema_type_util_1.typeToJsonSchemaType(contractBody.type, !strict),
            definitions: this.contract.types.reduce((defAcc, typeNode) => {
                return {
                    [typeNode.name]: json_schema_type_util_1.typeToJsonSchemaType(typeNode.typeDef.type, !strict),
                    ...defAcc
                };
            }, {})
        };
        const validateFn = jsv.compile(schema);
        const valid = validateFn(inputBody);
        if (valid) {
            return [];
        }
        if (!validateFn.errors) {
            throw new Error(`Body Validation reaches unexpected error for ${inputBody} with contract body ${contractBody.type}`);
        }
        const bodyTypeMismatches = validateFn.errors.map(e => {
            var _a;
            return `#${e.dataPath} ${(_a = e.message) !== null && _a !== void 0 ? _a : "JsonSchemaValidator encountered an unexpected error"}`;
        });
        if (bodyTypeMismatches.length > 0) {
            return [
                mismatches_1.bodyTypeDisparityMismatch(JSON.stringify(inputBody, undefined, 2), bodyTypeMismatches)
            ];
        }
        return [];
    }
    getQueryParamsArraySerializationStrategy() {
        const comma = this.contract.config.paramSerializationStrategy.query.array === "comma";
        return { comma };
    }
    findQueryParamMismatches(contractEndpoint, inputPath) {
        var _a, _b, _c;
        const contractQueryParams = (_b = (_a = contractEndpoint.request) === null || _a === void 0 ? void 0 : _a.queryParams) !== null && _b !== void 0 ? _b : [];
        const queryStringComponent = (_c = url.parse(inputPath).query) !== null && _c !== void 0 ? _c : "";
        const inputQueryParams = qs_1.default.parse(queryStringComponent, {
            ...this.getQueryParamsArraySerializationStrategy()
        });
        // Map to mark parameters that have been checked
        // Params that could not be checked have their flag set to false
        const verifiedQueryParams = Object.keys(inputQueryParams).reduce((acc, key) => ({ ...acc, [key]: false }), {});
        const mismatches = [];
        for (const { name: queryParamName, optional, type: contractQueryParamType } of contractQueryParams) {
            const requestQueryParam = inputQueryParams[queryParamName];
            // Query parameter is optional, can be skipped
            if (typeof requestQueryParam === "undefined" && optional) {
                continue;
            }
            // Query parameter is mandatory and hasn't been provided
            if (typeof requestQueryParam === "undefined") {
                mismatches.push(mismatches_1.requiredQueryParamMissingMismatch(queryParamName));
                continue;
            }
            // Mark query param as verified
            verifiedQueryParams[queryParamName] = true;
            // Validate current request query param against contract
            const result = this.findMismatchOnStringContent({ name: queryParamName, value: requestQueryParam }, contractQueryParamType);
            if (result.length > 0) {
                mismatches.push(mismatches_1.queryParamTypeDisparityMismatch(queryParamName, result));
            }
        }
        Object.entries(verifiedQueryParams)
            .filter(([, value]) => !value)
            .map(([key]) => key)
            .forEach(key => {
            mismatches.push(mismatches_1.undefinedQueryParamMismatch(key));
        });
        return mismatches;
    }
    findMismatchOnStringContent(content, contractContentTypeToCheckWith) {
        const stringValidator = new string_validator_1.StringValidator(this.typeTable);
        const valid = stringValidator.run(content, contractContentTypeToCheckWith);
        if (valid) {
            return [];
        }
        return stringValidator.messages;
    }
    getRelevantResponse(endpoint, userInputStatusCode) {
        if (endpoint.responses.length > 0) {
            for (const contractResponse of endpoint.responses) {
                if (contractResponse.status === userInputStatusCode) {
                    return contractResponse;
                }
            }
        }
        if (endpoint.defaultResponse) {
            return endpoint.defaultResponse;
        }
        // No response headers defined on the contract.
        return null;
    }
    getEndpointByRequest(userInputRequest) {
        const userInputRequestPath = userInputRequest.path.split("?")[0];
        const endpoint = this.contract.endpoints.find(value => {
            return (value.method === userInputRequest.method.toUpperCase() &&
                exports.pathMatchesVariablePath(value.path, userInputRequestPath));
        });
        return endpoint !== null && endpoint !== void 0 ? endpoint : null;
    }
}
exports.ContractMismatcher = ContractMismatcher;
// Transform /a/:b/c/:d/e -> /^/a/.+/c/.+/e$/
const regexForVariablePath = (path) => {
    const regexp = path.replace(/:[^/]+/g, ".+");
    return new RegExp(`^${regexp}$`);
};
const pathMatchesVariablePath = (variablePath, path) => {
    const variablePathRegex = regexForVariablePath(variablePath);
    return variablePathRegex.test(path);
};
exports.pathMatchesVariablePath = pathMatchesVariablePath;
