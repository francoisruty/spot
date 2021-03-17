import { Contract } from "../definitions";
import { Logger } from "../utilities/logger";
export interface ProxyConfig {
    protocol: "http" | "https";
    proxyBaseUrl: string;
}
/**
 * Runs a mock server that returns dummy data that conforms to an API definition.
 */
export declare function runMockServer(api: Contract, { port, pathPrefix, proxyConfig, logger }: {
    port: number;
    pathPrefix: string;
    proxyConfig?: ProxyConfig;
    logger: Logger;
}): {
    app: import("express-serve-static-core").Express;
    defer: () => Promise<void>;
};
