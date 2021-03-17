"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lint = void 0;
const rules_1 = require("./rules");
function lint(contract) {
    return Object.keys(rules_1.availableRules).reduce((acc, ruleName) => acc.concat({
        name: ruleName,
        violations: rules_1.availableRules[ruleName](contract)
    }), []);
}
exports.lint = lint;
