import { LintingRule } from "./rule";
export declare const availableRules: LintingRules;
interface LintingRules {
    [rule: string]: LintingRule;
}
export {};
