"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasResponse = void 0;
/**
 * Checks that all defined endpoints have at least one response.
 *
 * @param contract a contract
 */
function hasResponse(contract) {
    const violations = [];
    contract.endpoints
        .filter(endpoint => endpoint.responses.length === 0 &&
        endpoint.defaultResponse === undefined)
        .forEach(endpoint => {
        violations.push({
            message: `Endpoint (${endpoint.name}) does not declare any response`
        });
    });
    return violations;
}
exports.hasResponse = hasResponse;
