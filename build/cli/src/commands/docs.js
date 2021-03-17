"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const openapi3_1 = require("../../../lib/src/generators/openapi3/openapi3");
const parser_1 = require("../../../lib/src/parser");
const ARG_API = "spot_contract";
class Docs extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(Docs);
        const { port } = flags;
        const server = express_1.default();
        const docsDir = path_1.default.join(__dirname, "docs", "public");
        server.use(express_1.default.static(docsDir));
        /**
         * This endpoint is used by the following React Component:
         *   <RedocStandalone specUrl="/contract-openapi3" />
         * The contract is regenerated on each invocation (browser refresh)
         */
        server.get("/contract-openapi3", (req, res) => {
            const contract = parser_1.parse(args[ARG_API]);
            const openApiObj = openapi3_1.generateOpenAPI3(contract);
            res.send(openApiObj);
        });
        const start = async () => {
            try {
                this.log(`Documentation server started on port ${port}`);
                this.log(`Open http://localhost:${port} to view documentation`);
                await server.listen(port);
            }
            catch (err) {
                this.error(err, { exit: 1 });
            }
        };
        start();
    }
}
exports.default = Docs;
Docs.description = "Preview Spot contract as OpenAPI3 documentation. The documentation server will start on http://localhost:8080.";
Docs.examples = ["$ spot docs api.ts"];
Docs.args = [
    {
        name: ARG_API,
        required: true,
        description: "path to Spot contract",
        hidden: false
    }
];
Docs.flags = {
    help: command_1.flags.help({ char: "h" }),
    port: command_1.flags.integer({
        char: "p",
        description: "Documentation server port",
        default: 8080
    })
};
