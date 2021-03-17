"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const linter_1 = require("../../../lib/src/linting/linter");
const parser_1 = require("../../../lib/src/parser");
const find_lint_violations_1 = require("../../../lib/src/linting/find-lint-violations");
const ARG_API = "spot_contract";
// TODO: Make it possible to specify by reading a config file
const lintConfig = {
    rules: {
        "no-omittable-fields-within-response-bodies": "warn"
    }
};
/**
 * oclif command to lint a spot contract
 */
class Lint extends command_1.Command {
    async run() {
        const { args } = this.parse(Lint);
        const contractPath = args[ARG_API];
        const contract = parser_1.parse(contractPath);
        const groupedLintErrors = linter_1.lint(contract);
        const { errorCount, warningCount } = find_lint_violations_1.findLintViolations(groupedLintErrors, lintConfig, {
            error: (msg) => {
                this.error(msg, { exit: false });
            },
            warn: this.warn
        });
        this.log(`Found ${errorCount} errors and ${warningCount} warnings`);
        if (errorCount > 0) {
            process.exit(1);
        }
    }
}
exports.default = Lint;
Lint.description = "Lint a Spot contract";
Lint.examples = ["$ spot lint api.ts"];
Lint.args = [
    {
        name: ARG_API,
        required: true,
        description: "path to Spot contract",
        hidden: false
    }
];
Lint.flags = {
    help: command_1.flags.help({ char: "h" })
};
