import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Ensures nullable fields are not used in request components.
 *
 * @param contract a contract
 */
export declare function noNullableFieldsWithinRequestBodies(contract: Contract): LintingRuleViolation[];
