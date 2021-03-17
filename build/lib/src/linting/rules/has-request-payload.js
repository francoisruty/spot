"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRequestPayload = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
/**
 * Checks that endpoint request body's conform to HTTP method semantics:
 * - GET requests MUST NOT contain a request body
 * - POST | PATCH | PUT requests MUST contain a request body
 * - DELETE requests MAY contain a request body
 *
 * @param contract a contract
 */
function hasRequestPayload(contract) {
    const violations = [];
    contract.endpoints.forEach(endpoint => {
        var _a, _b;
        switch (endpoint.method) {
            case "GET":
                if ((_a = endpoint.request) === null || _a === void 0 ? void 0 : _a.body) {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) with HTTP method ${endpoint.method} must not contain a request body`
                    });
                }
                break;
            case "POST":
            case "PATCH":
            case "PUT":
                if (!((_b = endpoint.request) === null || _b === void 0 ? void 0 : _b.body)) {
                    violations.push({
                        message: `Endpoint (${endpoint.name}) with HTTP method ${endpoint.method} must contain a request body`
                    });
                }
                break;
            case "DELETE":
                break;
            default:
                assert_never_1.default(endpoint.method);
        }
    });
    return violations;
}
exports.hasRequestPayload = hasRequestPayload;
