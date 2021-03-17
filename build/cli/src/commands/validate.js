"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const parser_1 = require("../../../lib/src/parser");
const ARG_API = "spot_contract";
/**
 * oclif command to validate a spot contract
 */
class Validate extends command_1.Command {
    async run() {
        const { args } = this.parse(Validate);
        try {
            parser_1.parse(args[ARG_API]);
            this.log("Contract is valid");
        }
        catch (e) {
            this.error(e);
        }
    }
}
exports.default = Validate;
Validate.description = "Validate a Spot contract";
Validate.examples = ["$ spot validate api.ts"];
Validate.args = [
    {
        name: ARG_API,
        required: true,
        description: "path to Spot contract",
        hidden: false
    }
];
Validate.flags = {
    help: command_1.flags.help({ char: "h" })
};
