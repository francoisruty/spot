import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Checks that all union members of object type are defined via type reference. This rule
 * ensures code generators have unique type names to use for data models. This rule is ignored
 * for two type union where one type is `null`, e.g. `{ name: String } | null`.
 *
 * @param contract a contract
 */
export declare function noInlineObjectsWithinUnions(contract: Contract): LintingRuleViolation[];
