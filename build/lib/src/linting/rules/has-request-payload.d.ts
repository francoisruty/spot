import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Checks that endpoint request body's conform to HTTP method semantics:
 * - GET requests MUST NOT contain a request body
 * - POST | PATCH | PUT requests MUST contain a request body
 * - DELETE requests MAY contain a request body
 *
 * @param contract a contract
 */
export declare function hasRequestPayload(contract: Contract): LintingRuleViolation[];
