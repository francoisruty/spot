"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasQueryParameters = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
/**
 * Checks that endpoint request payload conform to HTTP method semantics:
 * - PATCH | PUT | POST requests MUST NOT contain query parameters
 *
 * @param contract a contract
 */
function hasQueryParameters(contract) {
    const violations = [];
    contract.endpoints.forEach(endpoint => {
        switch (endpoint.method) {
            case "DELETE":
            case "GET":
                break;
            case "PATCH":
            case "POST":
            case "PUT":
                if (endpoint.request && endpoint.request.queryParams.length > 0) {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) with HTTP method ${endpoint.method} must not contain query parameters`
                    });
                }
                break;
            default:
                assert_never_1.default(endpoint.method);
        }
    });
    return violations;
}
exports.hasQueryParameters = hasQueryParameters;
