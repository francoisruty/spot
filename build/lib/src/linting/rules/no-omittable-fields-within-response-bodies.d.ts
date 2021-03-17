import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Ensures omittable fields are not used in response bodies.
 *
 * @param contract a contract
 */
export declare function noOmittableFieldsWithinResponseBodies(contract: Contract): LintingRuleViolation[];
