import { Contract } from "../../definitions";
import { LintingRuleViolation } from "../rule";
/**
 * Checks that all union types have a discriminator. A discriminator is *not* required for:
 * - a two type union where one type is `null`, e.g. `String | null`
 * - a union composed of `null` and other types of the same primitive type, e.g. `"one" | "two" | "three" | null`
 *
 * @param contract a contract
 */
export declare function hasDiscriminator(contract: Contract): LintingRuleViolation[];
