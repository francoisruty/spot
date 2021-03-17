"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noPrimitivesInRequest = void 0;
const types_1 = require("../../types");
/**
 * Request types should always be object types
 *
 * @param contract a contract
 */
function noPrimitivesInRequest(contract) {
    const violations = [];
    const typeTable = types_1.TypeTable.fromArray(contract.types);
    contract.endpoints.forEach(endpoint => {
        const { request } = endpoint;
        const body = request && request.body;
        if (!body) {
            return;
        }
        const bodyType = types_1.dereferenceType(body.type, typeTable);
        if (!types_1.isObjectType(bodyType)) {
            violations.push({
                message: `Endpoint (${endpoint.name}) must contain a request as an object`
            });
        }
    });
    return violations;
}
exports.noPrimitivesInRequest = noPrimitivesInRequest;
