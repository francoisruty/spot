"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const server_1 = require("../../../lib/src/mock-server/server");
const parser_1 = require("../../../lib/src/parser");
const infer_proxy_config_1 = __importDefault(require("../common/infer-proxy-config"));
const ARG_API = "spot_contract";
/**
 * oclif command to run a mock server based on a Spot contract
 */
class Mock extends command_1.Command {
    async run() {
        const { args, flags: { port, pathPrefix, proxyBaseUrl = "" } } = this.parse(Mock);
        try {
            const proxyConfig = infer_proxy_config_1.default(proxyBaseUrl);
            const contract = parser_1.parse(args[ARG_API]);
            await server_1.runMockServer(contract, {
                port,
                pathPrefix: pathPrefix !== null && pathPrefix !== void 0 ? pathPrefix : "",
                ...proxyConfig,
                logger: this
            }).defer();
            this.log(`Mock server is running on port ${port}.`);
        }
        catch (e) {
            this.error(e, { exit: 1 });
        }
    }
}
exports.default = Mock;
Mock.description = "Run a mock server based on a Spot contract";
Mock.examples = ["$ spot mock api.ts"];
Mock.args = [
    {
        name: ARG_API,
        required: true,
        description: "path to Spot contract",
        hidden: false
    }
];
Mock.flags = {
    help: command_1.flags.help({ char: "h" }),
    proxyBaseUrl: command_1.flags.string({
        description: "If set, the server will act as a proxy and fetch data from the given remote server instead of mocking it"
    }),
    port: command_1.flags.integer({
        char: "p",
        description: "Port on which to run the mock server",
        default: 3010,
        required: true
    }),
    pathPrefix: command_1.flags.string({
        description: "Prefix to prepend to each endpoint path"
    })
};
