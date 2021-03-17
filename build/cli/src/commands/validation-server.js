"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const parser_1 = require("../../../lib/src/parser");
const server_1 = require("../../../lib/src/validation-server/server");
const ARG_API = "spot_contract";
/**
 * oclif command to start the spot contract validation server
 */
class ValidationServer extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(ValidationServer);
        const contractPath = args[ARG_API];
        const { port } = flags;
        try {
            this.log("Parsing contract...");
            const contract = parser_1.parse(contractPath);
            this.log("Starting validation server...");
            await server_1.runValidationServer(port, contract).defer();
            this.log(`Validation server running on port ${port}`);
        }
        catch (e) {
            this.error(e, { exit: 1 });
        }
    }
}
exports.default = ValidationServer;
ValidationServer.description = "Start the spot contract validation server";
ValidationServer.examples = ["$ spot validation-server api.ts"];
ValidationServer.args = [
    {
        name: ARG_API,
        required: true,
        description: "path to Spot contract",
        hidden: false
    }
];
ValidationServer.flags = {
    help: command_1.flags.help({ char: "h" }),
    port: command_1.flags.integer({
        char: "p",
        default: 5907,
        description: "The port where application will be available"
    })
};
