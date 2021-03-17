export interface OpenApiV2 {
    swagger: "2.0";
    info: InfoObject;
    host?: string;
    basePath?: string;
    schemes?: Schemes[];
    consumes?: string[];
    produces?: string[];
    paths: PathsObject;
    definitions?: DefinitionsObject;
    parameters?: ParametersDefinitionsObject;
    responses?: ResponsesDefinitionsObject;
    securityDefinitions?: SecurityDefinitionsObject;
    security?: SecurityRequirementObject[];
    tags?: TagObject[];
    externalDocs?: ExternalDocumentationObject;
}
export interface InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
}
export interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
}
export interface LicenseObject {
    name: string;
    url?: string;
}
export interface PathsObject {
    [path: string]: PathItemObject;
}
export interface PathItemObject {
    $ref?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    parameters?: (ParameterObject | ReferenceObject)[];
}
export interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    consumes?: string[];
    produces?: string[];
    parameters?: (ParameterObject | ReferenceObject)[];
    responses: ResponsesObject;
    schemes?: Schemes[];
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
}
export interface ResponsesObject {
    [statusCodeOrDefault: string]: ResponseObject | ReferenceObject;
}
export interface ResponseObject {
    description: string;
    schema?: SchemaObject;
    headers?: HeadersObject;
    examples?: ExampleObject;
}
export interface HeadersObject {
    [name: string]: HeaderObject;
}
export declare type HeaderObject = StringHeaderObject | NumberHeaderObject | IntegerHeaderObject | BooleanHeaderObject | ArrayHeaderObject;
export interface StringHeaderObject extends HeaderObjectBase, StringParameterObject {
}
export interface NumberHeaderObject extends HeaderObjectBase, NumberParameterObjectType {
}
export interface IntegerHeaderObject extends HeaderObjectBase, IntegerParameterObjectType {
}
export interface BooleanHeaderObject extends HeaderObjectBase, BooleanParameterObjectType {
}
export interface ArrayHeaderObject extends HeaderObjectBase, ArrayParameterObjectType {
}
interface HeaderObjectBase {
    description?: string;
}
/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject
 * There is a fair amount of duplication with the header object, however the differences
 * are complex enough to warrant keeping the definitions completely isolated from each other.
 */
export declare type ParameterObject = QueryParameterObject | HeaderParameterObject | PathParameterObject | FormDataParameterObject | BodyParameterObject;
export declare type QueryParameterObject = {
    in: "query";
    allowEmptyValue?: boolean;
} & ParameterObjectBase & QueryParameterObjectType;
export declare type HeaderParameterObject = {
    in: "header";
} & ParameterObjectBase & HeaderParameterObjectType;
export declare type PathParameterObject = {
    in: "path";
    required: true;
} & ParameterObjectBase & PathParameterObjectType;
export declare type FormDataParameterObject = {
    in: "formData";
    allowEmptyValue?: boolean;
} & ParameterObjectBase & FormDataParameterObjectType;
export declare type BodyParameterObject = {
    in: "body";
    schema: SchemaObject;
} & ParameterObjectBase;
interface ParameterObjectBase {
    name: string;
    in: "query" | "header" | "path" | "formData" | "body";
    description?: string;
    required?: boolean;
}
declare type QueryParameterObjectType = BaseParameterObjectTypes | ArrayMultiParameterObjectType;
declare type HeaderParameterObjectType = BaseParameterObjectTypes | ArrayParameterObjectType;
declare type PathParameterObjectType = BaseParameterObjectTypes | ArrayParameterObjectType;
declare type FormDataParameterObjectType = BaseParameterObjectTypes | ArrayMultiParameterObjectType | FileParameterObjectType;
declare type BaseParameterObjectTypes = StringParameterObject | NumberParameterObjectType | IntegerParameterObjectType | BooleanParameterObjectType;
export interface StringParameterObject {
    type: "string";
    format?: "byte" | "binary" | "date" | "date-time" | "password";
    default?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    enum?: string[];
}
export interface NumberParameterObjectType extends NumberParameterObjectTypeBase {
    type: "number";
    format?: "float" | "double";
    default?: number;
}
export interface IntegerParameterObjectType extends NumberParameterObjectTypeBase {
    type: "integer";
    format?: "int32" | "int64";
    default?: number;
}
export interface BooleanParameterObjectType {
    type: "boolean";
    default?: boolean;
    enum?: boolean[];
}
export interface FileParameterObjectType {
    type: "file";
}
export interface ArrayParameterObjectType extends ArrayParameterObjectTypeBase {
    collectionFormat?: "csv" | "ssv" | "tsv" | "pipes";
}
export interface ArrayMultiParameterObjectType extends ArrayParameterObjectTypeBase {
    collectionFormat?: "csv" | "ssv" | "tsv" | "pipes" | "multi";
}
interface ArrayParameterObjectTypeBase {
    type: "array";
    items: ItemsObject;
    default?: any[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
}
interface NumberParameterObjectTypeBase {
    default?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    enum?: number[];
    multipleOf?: number;
}
/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject
 * The items object is similar enough to the header object to warrant use of the
 * `Exclude` utility type.
 */
export declare type ItemsObject = Exclude<HeaderObject, "description">;
export interface DefinitionsObject {
    [name: string]: SchemaObject;
}
export interface ParametersDefinitionsObject {
    [name: string]: ParameterObject;
}
export interface ResponsesDefinitionsObject {
    [name: string]: ResponseObject;
}
export interface SecurityDefinitionsObject {
    [name: string]: SecuritySchemeObject;
}
export declare type SecuritySchemeObject = BasicSecuritySchemeObject | ApiKeySecuritySchemeObject | OAuth2SecuritySchemeObject;
export interface BasicSecuritySchemeObject extends SecuritySchemeObjectBase {
    type: "basic";
}
export interface ApiKeySecuritySchemeObject extends SecuritySchemeObjectBase {
    type: "apiKey";
    name: string;
    in: "query" | "header";
}
export declare type OAuth2SecuritySchemeObject = ImplicitOAuth2SecuritySchemeObject | PasswordOAuth2SecuritySchemeObject | ApplicationOAuth2SecuritySchemeObject | AccessCodeOAuth2SecuritySchemeObject;
export interface ImplicitOAuth2SecuritySchemeObject extends OAuth2SecuritySchemeObjectBase, SecuritySchemeObjectBase {
    flow: "implicit";
    authorizationUrl: string;
}
export interface PasswordOAuth2SecuritySchemeObject extends OAuth2SecuritySchemeObjectBase, SecuritySchemeObjectBase {
    flow: "password";
    tokenUrl: string;
}
export interface ApplicationOAuth2SecuritySchemeObject extends OAuth2SecuritySchemeObjectBase, SecuritySchemeObjectBase {
    flow: "application";
    tokenUrl: string;
}
export interface AccessCodeOAuth2SecuritySchemeObject extends OAuth2SecuritySchemeObjectBase, SecuritySchemeObjectBase {
    flow: "accessCode";
    authorizationUrl: string;
    tokenUrl: string;
}
interface OAuth2SecuritySchemeObjectBase {
    type: "oauth2";
    scopes: ScopesObject;
}
interface SecuritySchemeObjectBase {
    description?: string;
}
export interface ScopesObject {
    [name: string]: string;
}
export interface SecurityRequirementObject {
    [name: string]: string[];
}
export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}
export interface ExternalDocumentationObject {
    description?: string;
    url: string;
}
export interface ExampleObject {
    [mimeType: string]: any;
}
export declare type SchemaObject = NumberSchemaObject | IntegerSchemaObject | StringSchemaObject | BooleanSchemaObject | ArraySchemaObject | ObjectSchemaObject | AnySchemaObject | AllOfSchemaObject | ReferenceSchemaObject;
interface SchemaObjectBase {
    /**
     * OpenAPI 2 does not support null types. We apply the commonly used
     * vendor extension `x-nullable` to describe nullability.
     *
     * See https://stackoverflow.com/a/48114322.
     */
    "x-nullable"?: boolean;
    title?: string;
    description?: string;
    example?: any;
    externalDocs?: ExternalDocumentationObject;
}
export interface NumberSchemaObject extends SchemaObjectBase, NumberSchemaObjectBase {
    type: "number";
    format?: "float" | "double";
}
export interface IntegerSchemaObject extends SchemaObjectBase, NumberSchemaObjectBase {
    type: "integer";
    format?: "int32" | "int64";
}
interface NumberSchemaObjectBase {
    default?: number;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    enum?: (number | null)[];
}
export interface StringSchemaObject extends SchemaObjectBase {
    type: "string";
    default?: string;
    maxLength?: number;
    minLength?: number;
    /**
     * OpenAPI allows custom formats. We constrain the format here to those
     * that OpenAPI has defined and custom formats that Spot may produce.
     */
    format?: "date" | "date-time" | "password" | "byte" | "binary";
    pattern?: string;
    enum?: (string | null)[];
}
export interface BooleanSchemaObject extends SchemaObjectBase {
    type: "boolean";
    enum?: (boolean | null)[];
    default?: boolean;
}
export interface ArraySchemaObject extends SchemaObjectBase {
    type: "array";
    default?: any[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    items: SchemaObject;
}
export interface ObjectSchemaObject extends SchemaObjectBase {
    type: "object";
    default?: any;
    required?: string[];
    maxProperties?: number;
    minProperties?: number;
    properties?: ObjectPropertiesSchemaObject;
    additionalProperties?: SchemaObject | boolean;
}
export interface ObjectPropertiesSchemaObject {
    [name: string]: SchemaObject & ObjectPropertySchemaObjectBase;
}
interface ObjectPropertySchemaObjectBase {
    readOnly?: boolean;
    xml?: XmlObject;
}
export interface AnySchemaObject extends SchemaObjectBase {
    AnyValue: {};
}
export interface AllOfSchemaObject extends SchemaObjectBase {
    allOf: SchemaObject[];
    discriminator?: string;
}
export interface ReferenceSchemaObject {
    $ref: string;
}
export interface XmlObject {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
}
export interface ReferenceObject {
    $ref: string;
}
declare type Schemes = "http" | "https" | "ws" | "wss";
export {};
