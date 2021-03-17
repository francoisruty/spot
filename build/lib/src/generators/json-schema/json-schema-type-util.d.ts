import { Type } from "../../types";
import { JsonSchemaType } from "./json-schema-specification";
/**
 * Generate a JSON Schema type definition. `objectAdditionalProperties` may
 * be used to configure whether additional properties should be allowed on
 * object types. This can be useful for data validation purposes where
 * property validation can be strict or lenient.
 *
 * @param type a contract type
 * @param objectAdditionalProperties whether to allow additional properties for objects
 */
export declare function typeToJsonSchemaType(type: Type, objectAdditionalProperties?: boolean): JsonSchemaType;
