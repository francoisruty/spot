"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const hash_1 = require("../../../lib/src/checksum/hash");
const parser_1 = require("../../../lib/src/parser");
const ARG_API = "spot_contract";
/**
 * oclif command to generate a checksum for a Spot contract
 */
class Checksum extends command_1.Command {
    async run() {
        const { args } = this.parse(Checksum);
        try {
            const contract = parser_1.parse(args[ARG_API]);
            const hash = hash_1.hashContract(contract);
            this.log(hash);
        }
        catch (e) {
            this.error(e, { exit: 1 });
        }
    }
}
exports.default = Checksum;
Checksum.description = "Generate a checksum for a Spot contract";
Checksum.examples = ["$ spot checksum api.ts"];
Checksum.args = [
    {
        name: ARG_API,
        required: true,
        description: "path to Spot contract",
        hidden: false
    }
];
Checksum.flags = {
    help: command_1.flags.help({ char: "h" })
};
