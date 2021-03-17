import { Type, TypeTable } from "../../types";
import { ReferenceObject, SchemaObject } from "./openapi3-specification";
export declare function typeToSchemaOrReferenceObject(type: Type, typeTable: TypeTable, nullable?: boolean): SchemaObject | ReferenceObject;
export declare function isReferenceObject(typeObject: SchemaObject | ReferenceObject): typeObject is ReferenceObject;
