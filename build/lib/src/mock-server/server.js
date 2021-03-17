"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMockServer = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const types_1 = require("../types");
const dummy_1 = require("./dummy");
const matcher_1 = require("./matcher");
const proxy_1 = require("./proxy");
/**
 * Runs a mock server that returns dummy data that conforms to an API definition.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function runMockServer(api, { port, pathPrefix, proxyConfig, logger }) {
    const app = express_1.default();
    app.use(cors_1.default());
    app.use((req, resp, next) => {
        if (req.path.includes("/_draft/")) {
            req.url = req.url.replace("/_draft/", "/");
        }
        next();
    });
    app.use((req, resp) => {
        var _a;
        for (const endpoint of api.endpoints) {
            if (matcher_1.isRequestForEndpoint(req, pathPrefix, endpoint)) {
                // non-draft end points get real response
                const shouldProxy = !endpoint.draft;
                if (shouldProxy && proxyConfig) {
                    return proxy_1.proxyRequest({
                        incomingRequest: req,
                        response: resp,
                        ...proxyConfig
                    });
                }
                logger.log(`Request hit for ${endpoint.name} registered.`);
                const response = (_a = endpoint.responses[0]) !== null && _a !== void 0 ? _a : endpoint.defaultResponse;
                if (!response) {
                    logger.error(`No response defined for endpoint ${endpoint.name}`);
                    return;
                }
                resp.status("status" in response ? response.status : 200);
                resp.header("content-type", "application/json");
                if (response.body) {
                    resp.send(JSON.stringify(dummy_1.generateData(types_1.TypeTable.fromArray(api.types), response.body.type)));
                }
                return;
            }
        }
        logger.error(`No match for request ${req.method} at ${req.path}.`);
    });
    return {
        app,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        defer: () => new Promise(resolve => app.listen(port, resolve))
    };
}
exports.runMockServer = runMockServer;
