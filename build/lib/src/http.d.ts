import { Type, TypeTable } from "./types";
/**
 * Check if a type is safe for use as a path parameter.
 *
 * @param type type to check
 * @param typeTable type lookup table
 */
export declare function isPathParamTypeSafe(type: Type, typeTable: TypeTable): boolean;
/**
 * Check if a type is safe for use as a query parameter.
 *
 * @param type type to check
 * @param typeTable type lookup table
 */
export declare function isQueryParamTypeSafe(type: Type, typeTable: TypeTable): boolean;
/**
 * Check if a type is safe for use as a header type.
 *
 * @param type type to check
 * @param typeTable type lookup table
 */
export declare function isHeaderTypeSafe(type: Type, typeTable: TypeTable): boolean;
