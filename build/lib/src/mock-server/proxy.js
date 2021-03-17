"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyRequest = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
function proxyRequest({ incomingRequest, response, protocol, proxyBaseUrl }) {
    const requestHandler = protocol === "http" ? http_1.default : https_1.default;
    const options = {
        headers: incomingRequest.headers,
        method: incomingRequest.method,
        path: incomingRequest.path
    };
    const proxyRequest = requestHandler.request(proxyBaseUrl, options, res => {
        var _a;
        // Forward headers
        response.writeHead((_a = res.statusCode) !== null && _a !== void 0 ? _a : response.statusCode, res.headers);
        res.pipe(response);
    });
    if (incomingRequest.body) {
        proxyRequest.write(incomingRequest.body);
    }
    proxyRequest.end();
}
exports.proxyRequest = proxyRequest;
