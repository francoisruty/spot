import { GroupedLintRuleViolations } from "./rule";
import { LintConfig } from "../../../cli/src/commands/lint";
interface FindLintViolationsDependencies {
    error: (msg: string) => void;
    warn: (msg: string) => void;
}
export interface FindLintViolationsResult {
    errorCount: number;
    warningCount: number;
}
/**
 * Responsible for triggering error or warn depending on whether the lint rule
 * violation setting is 'off', 'warn' or 'error'.
 *
 * By default, if a lint rule setting is not set in lintConfig,
 * then it will be considered a error.
 */
export declare const findLintViolations: (groupedLintErrors: GroupedLintRuleViolations[], lintConfig: LintConfig, { error, warn }: FindLintViolationsDependencies) => FindLintViolationsResult;
export {};
