import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Checks that all defined endpoints have at least one response.
 *
 * @param contract a contract
 */
export declare function hasResponse(contract: Contract): LintingRuleViolation[];
