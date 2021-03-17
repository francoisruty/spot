import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Checks that endpoint request payload conform to HTTP method semantics:
 * - PATCH | PUT | POST requests MUST NOT contain query parameters
 *
 * @param contract a contract
 */
export declare function hasQueryParameters(contract: Contract): LintingRuleViolation[];
