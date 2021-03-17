import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Request types should always be object types
 *
 * @param contract a contract
 */
export declare function noPrimitivesInRequest(contract: Contract): LintingRuleViolation[];
