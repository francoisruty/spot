"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasResponsePayload = void 0;
const definitions_1 = require("../../definitions");
/**
 * Checks that all defined responses have a response body.
 *
 * @param contract a contract
 */
function hasResponsePayload(contract) {
    const violations = [];
    contract.endpoints.forEach(endpoint => {
        findResponses(endpoint)
            .filter(response => response.body === undefined)
            .forEach(responseWithNoBody => {
            const responseIdentifier = definitions_1.isSpecificResponse(responseWithNoBody)
                ? `response for status ${responseWithNoBody.status}`
                : "default response";
            violations.push({
                message: `Endpoint (${endpoint.name}) ${responseIdentifier} is missing a response body`
            });
        });
    });
    return violations;
}
exports.hasResponsePayload = hasResponsePayload;
function findResponses(endpoint) {
    return [
        ...endpoint.responses,
        ...(endpoint.defaultResponse ? [endpoint.defaultResponse] : [])
    ];
}
