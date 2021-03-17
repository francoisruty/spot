"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenAPI3 = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const definitions_1 = require("../../definitions");
const types_1 = require("../../types");
const openapi3_type_util_1 = require("./openapi3-type-util");
const SECURITY_HEADER_SCHEME_NAME = "SecurityHeader";
function generateOpenAPI3(contract) {
    var _a;
    const typeTable = types_1.TypeTable.fromArray(contract.types);
    const openapi = {
        openapi: "3.0.2",
        info: {
            title: contract.name,
            description: contract.description,
            version: (_a = contract.version) !== null && _a !== void 0 ? _a : "0.0.0"
        },
        paths: endpointsToPathsObject(contract.endpoints, typeTable, contract.config),
        components: contractToComponentsObject(contract, typeTable),
        security: contract.security && [
            {
                [SECURITY_HEADER_SCHEME_NAME]: []
            }
        ]
    };
    return openapi;
}
exports.generateOpenAPI3 = generateOpenAPI3;
function contractToComponentsObject(contract, typeTable) {
    if (contract.types.length === 0 && contract.security === undefined) {
        return undefined;
    }
    return {
        schemas: contract.types.length > 0
            ? contractTypesToComponentsObjectSchemas(contract.types, typeTable)
            : undefined,
        securitySchemes: contract.security && {
            [SECURITY_HEADER_SCHEME_NAME]: {
                type: "apiKey",
                in: "header",
                name: contract.security.name,
                description: contract.security.description
            }
        }
    };
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
    const endpointRequestBody = endpointRequest === null || endpointRequest === void 0 ? void 0 : endpointRequest.body;
    return {
        tags: endpoint.tags.length > 0 ? endpoint.tags : undefined,
        description: endpoint.description,
        operationId: endpoint.name,
        parameters: endpointRequest &&
            endpointRequestToParameterObjects(endpointRequest, typeTable, config),
        requestBody: endpointRequestBody &&
            endpointRequestBodyToRequestBodyObject(endpointRequestBody, typeTable),
        responses: endpointResponsesToResponsesObject({
            specific: endpoint.responses,
            default: endpoint.defaultResponse
        }, typeTable)
    };
}
function endpointRequestToParameterObjects(request, typeTable, config) {
    const pathParameters = request.pathParams.map(p => ({
        name: p.name,
        in: "path",
        description: p.description,
        required: true,
        schema: openapi3_type_util_1.typeToSchemaOrReferenceObject(p.type, typeTable),
        examples: exampleToOpenApiExampleSet(p.examples)
    }));
    const queryParameters = request.queryParams.map(p => ({
        name: p.name,
        in: "query",
        description: p.description,
        ...typeToQueryParameterSerializationStrategy(p.type, typeTable, config),
        required: !p.optional,
        schema: openapi3_type_util_1.typeToSchemaOrReferenceObject(p.type, typeTable),
        examples: exampleToOpenApiExampleSet(p.examples)
    }));
    const headerParameters = request.headers.map(p => ({
        name: p.name,
        in: "header",
        description: p.description,
        required: !p.optional,
        schema: openapi3_type_util_1.typeToSchemaOrReferenceObject(p.type, typeTable),
        examples: exampleToOpenApiExampleSet(p.examples)
    }));
    const parameters = [];
    return parameters.concat(pathParameters, queryParameters, headerParameters);
}
function typeToQueryParameterSerializationStrategy(type, typeTable, config) {
    const possibleTypes = types_1.possibleRootTypes(type, typeTable).filter(types_1.isNotNullType);
    if (possibleTypes.length === 0) {
        throw new Error("Unexpected error: query param resolved to no types");
    }
    // Style is ambigious for a union containing both object and array types
    // TODO: warn
    const possiblyObjectType = possibleTypes.some(types_1.isObjectType);
    const possiblyArrayType = possibleTypes.some(types_1.isArrayType);
    if (possiblyObjectType && !possiblyArrayType) {
        return { style: "deepObject", explode: true };
    }
    if (possiblyArrayType && !possiblyObjectType) {
        switch (config.paramSerializationStrategy.query.array) {
            case "ampersand": {
                return { style: "form", explode: true };
            }
            case "comma": {
                return { style: "form", explode: false };
            }
            default:
                assert_never_1.default(config.paramSerializationStrategy.query.array);
        }
    }
    return {};
}
function endpointRequestBodyToRequestBodyObject(requestBody, typeTable) {
    const content = {
        "application/json": {
            schema: openapi3_type_util_1.typeToSchemaOrReferenceObject(requestBody.type, typeTable)
        }
    };
    // TODO: currently Spot does not support optional request body
    return { content, required: true };
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
            acc[header.name] = headerToHeaderObject(header, typeTable);
            return acc;
        }, {})
        : undefined;
    const content = response.body && {
        "application/json": {
            schema: openapi3_type_util_1.typeToSchemaOrReferenceObject(response.body.type, typeTable)
        }
    };
    return { description, headers, content };
}
function headerToHeaderObject(header, typeTable) {
    return {
        description: header.description,
        required: !header.optional,
        schema: openapi3_type_util_1.typeToSchemaOrReferenceObject(header.type, typeTable)
    };
}
function contractTypesToComponentsObjectSchemas(types, typeTable) {
    return types.reduce((acc, t) => {
        const typeObject = openapi3_type_util_1.typeToSchemaOrReferenceObject(t.typeDef.type, typeTable);
        if (!openapi3_type_util_1.isReferenceObject(typeObject)) {
            typeObject.description = t.typeDef.description;
        }
        acc[t.name] = typeObject;
        return acc;
    }, {});
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
function exampleToOpenApiExampleSet(examples) {
    return examples === null || examples === void 0 ? void 0 : examples.reduce((acc, example) => {
        acc[example.name] = {
            value: example.value
        };
        return acc;
    }, {});
}
