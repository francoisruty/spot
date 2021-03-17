"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function inferProxyConfig(proxyBaseUrl) {
    if (!proxyBaseUrl) {
        return null;
    }
    const [protocol] = proxyBaseUrl.split("://");
    if (protocol !== "http" && protocol !== "https") {
        throw new Error('Could not infer protocol from proxy base url, should be either "http" or "https".');
    }
    return {
        protocol,
        proxyBaseUrl
    };
}
exports.default = inferProxyConfig;
