"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLintViolations = void 0;
/**
 * Responsible for triggering error or warn depending on whether the lint rule
 * violation setting is 'off', 'warn' or 'error'.
 *
 * By default, if a lint rule setting is not set in lintConfig,
 * then it will be considered a error.
 */
const findLintViolations = (groupedLintErrors, lintConfig, { error, warn }) => {
    let errorCount = 0;
    let warningCount = 0;
    groupedLintErrors.forEach(lintingErrors => {
        var _a;
        const ruleSetting = (_a = lintConfig["rules"][lintingErrors.name]) !== null && _a !== void 0 ? _a : "error";
        switch (ruleSetting) {
            case "error": {
                lintingErrors.violations.forEach(lintError => {
                    error(lintError.message);
                    errorCount++;
                });
                break;
            }
            case "warn": {
                lintingErrors.violations.forEach(lintWarning => {
                    warn(lintWarning.message);
                    warningCount++;
                });
                break;
            }
            case "off": {
                break;
            }
            default: {
                error(`Unknown lint rule setting for ${lintingErrors.name}: ${ruleSetting}`);
                errorCount++;
            }
        }
    });
    return {
        errorCount,
        warningCount
    };
};
exports.findLintViolations = findLintViolations;
