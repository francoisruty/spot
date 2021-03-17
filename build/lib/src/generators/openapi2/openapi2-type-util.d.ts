import { Type, TypeTable } from "../../types";
import { ReferenceSchemaObject, SchemaObject } from "./openapi2-specification";
export declare function typeToSchemaObject(type: Type, typeTable: TypeTable, nullable?: boolean): SchemaObject;
export declare function isReferenceSchemaObject(typeObject: SchemaObject): typeObject is ReferenceSchemaObject;
