import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Ensures that arrays are not part of nullable unions
 *
 * @param contract a contract
 */
export declare function noNullableArrays(contract: Contract): LintingRuleViolation[];
