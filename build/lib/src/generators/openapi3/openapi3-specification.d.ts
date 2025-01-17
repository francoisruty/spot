export interface OpenApiV3 {
    openapi: "3.0.2";
    info: InfoObject;
    servers?: ServerObject[];
    paths: PathsObject;
    components?: ComponentsObject;
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
export interface ServerObject {
    url: string;
    description?: string;
    variables?: {
        [serverVariable: string]: ServerVariableObject;
    };
}
export interface ServerVariableObject {
    enum?: string[];
    default: string;
    description?: string;
}
export interface PathsObject {
    [path: string]: PathItemObject;
}
export interface PathItemObject {
    $ref?: string;
    summary?: string;
    description?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    trace?: OperationObject;
    servers?: ServerObject[];
    parameters?: (ParameterObject | ReferenceObject)[];
}
export interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    responses: ResponsesObject;
    callbacks?: {
        [callback: string]: CallbackObject | ReferenceObject;
    };
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
}
export interface ReferenceObject {
    $ref: string;
    /**
     * WARNING
     *
     * `nullable: true` will occur when exactly one type reference is combined with null.
     *
     * Example:
     *
     * `MyType | null`
     *
     * https://swagger.io/docs/specification/using-ref/#considerations
     *
     * Schema references cannot contain sibling elements. `nullable` therefore should
     * not be combined with schema reference objects. This rule was misunderstood during
     * development on the OpenAPI 3 generator at Airtasker. This will be removed in a
     * future version of Spot when Airtasker's tooling supports an alternative valid
     * representation for the above scenario.
     *
     * TODO: Find a way to remove this
     * A possible seemingly accepted workaround to this is to wrap the schema reference
     * into an allOf.
     *
     * Example:
     *
     * ```
     * nullable: true
     * allOf:
     *   - $ref: #/components/schemas/MyType
     * ```
     */
    nullable?: boolean;
}
export interface RequestBodyObject {
    description?: string;
    content: {
        [mediaType: string]: MediaTypeObject;
    };
    required?: boolean;
}
export declare type MediaTypeObject = {
    schema?: SchemaObject | ReferenceObject;
    encoding?: {
        [encoding: string]: EncodingObject;
    };
} & MutuallyExclusiveExample;
export declare type SchemaObject = NumberSchemaObject | IntegerSchemaObject | StringSchemaObject | BooleanSchemaObject | ArraySchemaObject | ObjectSchemaObject | AnySchemaObject | AllOfSchemaObject | OneOfSchemaObject | AnyOfSchemaObject | NotSchemaObject;
interface SchemaObjectBase {
    nullable?: boolean;
    not?: SchemaObject | ReferenceObject;
    title?: string;
    description?: string;
    example?: any;
    externalDocs?: ExternalDocumentationObject;
    deprecated?: boolean;
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
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    multipleOf?: number;
    enum?: (number | null)[];
    default?: number;
}
export interface StringSchemaObject extends SchemaObjectBase {
    type: "string";
    maxLength?: number;
    minLength?: number;
    /**
     * OpenAPI allows custom formats. We constrain the format here to those
     * that OpenAPI has defined and custom formats that Spot may produce.
     */
    format?: "date" | "date-time" | "password" | "byte" | "binary";
    pattern?: string;
    enum?: (string | null)[];
    default?: string;
}
export interface BooleanSchemaObject extends SchemaObjectBase {
    type: "boolean";
    enum?: (boolean | null)[];
    default?: boolean;
}
export interface ArraySchemaObject extends SchemaObjectBase {
    type: "array";
    items: SchemaObject | ReferenceObject;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    default?: any[];
}
export interface ObjectSchemaObject extends SchemaObjectBase {
    type: "object";
    properties?: ObjectPropertiesSchemaObject;
    required?: string[];
    additionalProperties?: SchemaObject | ReferenceObject | boolean;
    maxProperties?: number;
    minProperties?: number;
    default?: any;
}
export interface ObjectPropertiesSchemaObject {
    [name: string]: (SchemaObject & ObjectPropertySchemaObjectBase) | ReferenceObject;
}
interface ObjectPropertySchemaObjectBase {
    xml?: XmlObject;
    readOnly?: boolean;
    writeOnly?: boolean;
}
export interface AnySchemaObject extends SchemaObjectBase {
    AnyValue: {};
}
export interface AllOfSchemaObject extends SchemaObjectBase {
    allOf: (SchemaObject | ReferenceObject)[];
    discriminator?: DiscriminatorObject;
}
export interface OneOfSchemaObject extends SchemaObjectBase {
    oneOf: (SchemaObject | ReferenceObject)[];
    discriminator?: DiscriminatorObject;
}
export interface AnyOfSchemaObject extends SchemaObjectBase {
    anyOf: (SchemaObject | ReferenceObject)[];
    discriminator?: DiscriminatorObject;
}
export interface NotSchemaObject extends SchemaObjectBase {
    not: SchemaObject | ReferenceObject;
}
export interface DiscriminatorObject {
    propertyName: string;
    mapping?: {
        [key: string]: string;
    };
}
export declare type SecuritySchemeObject = ApiKeySecuritySchemeObject | HttpSecuritySchemeObject | OAuth2SecuritySchemeObject | OpenIdConnectSecuritySchemeObject;
export interface ApiKeySecuritySchemeObject extends SecuritySchemeObjectBase {
    type: "apiKey";
    name: string;
    in: "query" | "header" | "cookie";
}
export interface HttpSecuritySchemeObject extends SecuritySchemeObjectBase {
    type: "http";
    scheme: string;
    bearerFormat?: string;
}
export interface OAuth2SecuritySchemeObject extends SecuritySchemeObjectBase {
    type: "oauth2";
    flows: OAuthFlowsObject;
}
export interface OpenIdConnectSecuritySchemeObject extends SecuritySchemeObjectBase {
    type: "openIdConnect";
    openIdConnectUrl: string;
}
interface SecuritySchemeObjectBase {
    type: SecuritySchemeType;
    description?: string;
}
declare type SecuritySchemeType = "apiKey" | "http" | "oauth2" | "openIdConnect";
export interface OAuthFlowsObject {
    implicit?: ImplicitOAuthFlowObject;
    password?: PasswordOAuthFlowObject;
    clientCredentials?: ClientCredentialsOAuthFlowObject;
    authorizationCode?: AuthorizationCodeOAuthFlowObject;
}
export interface ImplicitOAuthFlowObject extends OAuthFlowObjectBase {
    authorizationUrl: string;
}
export interface PasswordOAuthFlowObject extends OAuthFlowObjectBase {
    tokenUrl: string;
}
export interface ClientCredentialsOAuthFlowObject extends OAuthFlowObjectBase {
    tokenUrl: string;
}
export interface AuthorizationCodeOAuthFlowObject extends OAuthFlowObjectBase {
    authorizationUrl: string;
    tokenUrl: string;
}
interface OAuthFlowObjectBase {
    refreshUrl?: string;
    scopes: {
        [scope: string]: string;
    };
}
export interface SecurityRequirementObject {
    [name: string]: string[];
}
export interface ComponentsObject {
    schemas?: {
        [schema: string]: SchemaObject | ReferenceObject;
    };
    responses?: {
        [response: string]: ResponseObject | ReferenceObject;
    };
    parameters?: {
        [parameter: string]: ParameterObject | ReferenceObject;
    };
    examples?: {
        [example: string]: ExampleObject | ReferenceObject;
    };
    requestBodies?: {
        [request: string]: RequestBodyObject | ReferenceObject;
    };
    headers?: {
        [header: string]: HeaderObject | ReferenceObject;
    };
    securitySchemes?: {
        [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
    };
    links?: {
        [link: string]: LinkObject | ReferenceObject;
    };
    callbacks?: {
        [callback: string]: CallbackObject | ReferenceObject;
    };
}
export interface XmlObject {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
}
export declare type ExampleObject = {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
} & MutuallyExclusiveExampleObjectValue;
declare type MutuallyExclusiveExampleObjectValue = {
    value: any;
    externalValue?: never;
} | {
    value?: never;
    externalValue: string;
};
export interface EncodingObject {
    contentType?: string;
    headers?: {
        [name: string]: HeaderObject | ReferenceObject;
    };
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
}
export interface ResponsesObject {
    [statusCodeOrDefault: string]: ResponseObject | ReferenceObject;
}
export interface ResponseObject {
    description: string;
    headers?: {
        [name: string]: HeaderObject | ReferenceObject;
    };
    content?: {
        [mediaType: string]: MediaTypeObject;
    };
    links?: {
        [link: string]: LinkObject | ReferenceObject;
    };
}
export declare type ParameterObject = QueryParameterObject | HeaderParameterObject | PathParameterObject | CookieParameterObject;
export declare type QueryParameterObject = ParameterObjectBase & {
    in: "query";
    allowEmptyValue?: boolean;
    style?: "form" | "spaceDelimited" | "pipeDelimited" | "deepObject";
    allowReserved?: boolean;
};
export declare type HeaderParameterObject = ParameterObjectBase & {
    in: "header";
    style?: "simple";
};
export declare type PathParameterObject = ParameterObjectBase & {
    in: "path";
    required: true;
    style?: "simple" | "label" | "matrix";
};
export declare type CookieParameterObject = ParameterObjectBase & {
    in: "cookie";
    style?: "form";
};
export declare type HeaderObject = Omit<HeaderParameterObject, "name" | "in">;
declare type ParameterObjectBase = {
    name: string;
    in: "query" | "header" | "path" | "cookie";
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    style?: ParameterStyle;
    explode?: boolean;
    schema?: SchemaObject | ReferenceObject;
} & MutuallyExclusiveExample;
declare type ParameterStyle = "matrix" | "label" | "form" | "simple" | "spaceDelimited" | "pipeDelimited" | "deepObject";
export interface CallbackObject {
    [name: string]: PathItemObject;
}
declare type LinkObject = {
    parameters?: {
        [name: string]: any;
    };
    requestBody?: any;
    description?: string;
    server?: ServerObject;
} & MutuallyExclusiveLinkObjectOperation;
declare type MutuallyExclusiveLinkObjectOperation = {
    operationRef: string;
    operationId?: never;
} | {
    operationRef?: never;
    operationId: string;
};
export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}
export interface ExternalDocumentationObject {
    description?: string;
    url: string;
}
export declare type ExamplesSet = {
    [example: string]: ExampleObject | ReferenceObject;
};
declare type MutuallyExclusiveExample = {
    example?: any;
    examples?: never;
} | {
    example?: never;
    examples?: ExamplesSet;
};
export {};
