import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Checks that all defined responses have a response body.
 *
 * @param contract a contract
 */
export declare function hasResponsePayload(contract: Contract): LintingRuleViolation[];
