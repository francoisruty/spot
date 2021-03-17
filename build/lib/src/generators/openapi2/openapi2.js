"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenAPI2 = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const definitions_1 = require("../../definitions");
const types_1 = require("../../types");
const openapi2_parameter_util_1 = require("./openapi2-parameter-util");
const openapi2_type_util_1 = require("./openapi2-type-util");
const SECURITY_HEADER_SCHEME_NAME = "SecurityHeader";
function generateOpenAPI2(contract) {
    var _a;
    const typeTable = types_1.TypeTable.fromArray(contract.types);
    const openapi = {
        swagger: "2.0",
        info: {
            title: contract.name,
            description: contract.description,
            version: (_a = contract.version) !== null && _a !== void 0 ? _a : "0.0.0"
        },
        consumes: ["application/json"],
        produces: ["application/json"],
        paths: endpointsToPathsObject(contract.endpoints, typeTable, contract.config),
        definitions: contractTypesToDefinitionsObject(contract.types, typeTable),
        securityDefinitions: contractSecurityToSecurityDefinitionsObject(contract.security),
        security: contract.security && [
            {
                [SECURITY_HEADER_SCHEME_NAME]: []
            }
        ]
    };
    return openapi;
}
exports.generateOpenAPI2 = generateOpenAPI2;
function contractTypesToDefinitionsObject(types, typeTable) {
    if (types.length === 0) {
        return;
    }
    return types.reduce((acc, t) => {
        const schemaObject = openapi2_type_util_1.typeToSchemaObject(t.typeDef.type, typeTable);
        if (!openapi2_type_util_1.isReferenceSchemaObject(schemaObject)) {
            schemaObject.description = t.typeDef.description;
        }
        acc[t.name] = schemaObject;
        return acc;
    }, {});
}
function contractSecurityToSecurityDefinitionsObject(security) {
    return (security && {
        [SECURITY_HEADER_SCHEME_NAME]: {
            type: "apiKey",
            in: "header",
            name: security.name,
            description: security.description
        }
    });
}
function endpointsToPathsObject(endpoints, typeTable, config) {
    return endpoints.reduce((acc, endpoint) => {
        var _a;
        const pathName = endpoint.path
            .split("/")
            .map(component => component.startsWith(":") ? `{${component.slice(1)}}` : component)
            .join("/");
        acc[pathName] = (_a = acc[pathName]) !== null && _a !== void 0 ? _a : {};
        const pathItemMethod = httpMethodToPathItemMethod(endpoint.method);
        acc[pathName][pathItemMethod] = endpointToOperationObject(endpoint, typeTable, config);
        return acc;
    }, {});
}
function endpointToOperationObject(endpoint, typeTable, config) {
    const endpointRequest = endpoint.request;
    return {
        tags: endpoint.tags.length > 0 ? endpoint.tags : undefined,
        description: endpoint.description,
        operationId: endpoint.name,
        parameters: endpointRequest &&
            endpointRequestToParameterObjects(endpointRequest, typeTable, config),
        responses: endpointResponsesToResponsesObject({
            specific: endpoint.responses,
            default: endpoint.defaultResponse
        }, typeTable)
    };
}
function endpointRequestToParameterObjects(request, typeTable, config) {
    const pathParameters = request.pathParams.map(p => openapi2_parameter_util_1.pathParamToPathParameterObject(p, typeTable));
    const queryParameters = request.queryParams.map(p => openapi2_parameter_util_1.queryParamToQueryParameterObject(p, typeTable, config));
    const headerParameters = request.headers.map(p => openapi2_parameter_util_1.requestHeaderToHeaderParameterObject(p, typeTable));
    const bodyParameter = request.body && {
        in: "body",
        name: "Body",
        required: true,
        schema: openapi2_type_util_1.typeToSchemaObject(request.body.type, typeTable)
    };
    const parameters = [];
    return parameters
        .concat(pathParameters, queryParameters, headerParameters)
        .concat(bodyParameter !== null && bodyParameter !== void 0 ? bodyParameter : []);
}
function endpointResponsesToResponsesObject(responses, typeTable) {
    const responsesObject = responses.specific.reduce((acc, response) => {
        acc[response.status.toString(10)] = endpointResponseToResponseObject(response, typeTable);
        return acc;
    }, {});
    if (responses.default) {
        responsesObject.default = endpointResponseToResponseObject(responses.default, typeTable);
    }
    return responsesObject;
}
function endpointResponseToResponseObject(response, typeTable) {
    var _a;
    const description = (_a = response.description) !== null && _a !== void 0 ? _a : (definitions_1.isSpecificResponse(response)
        ? `${response.status} response`
        : "default response");
    const headers = response.headers.length > 0
        ? response.headers.reduce((acc, header) => {
            acc[header.name] = openapi2_parameter_util_1.responseHeaderToHeaderObject(header, typeTable);
            return acc;
        }, {})
        : undefined;
    const schema = response.body && openapi2_type_util_1.typeToSchemaObject(response.body.type, typeTable);
    return { description, headers, schema };
}
function httpMethodToPathItemMethod(method) {
    switch (method) {
        case "GET":
            return "get";
        case "PUT":
            return "put";
        case "POST":
            return "post";
        case "DELETE":
            return "delete";
        case "PATCH":
            return "patch";
        default:
            assert_never_1.default(method);
    }
}
