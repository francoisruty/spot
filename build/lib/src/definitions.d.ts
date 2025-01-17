import { Type, TypeDef } from "./types";
export interface Contract {
    name: string;
    description?: string;
    version?: string;
    config: Config;
    types: {
        name: string;
        typeDef: TypeDef;
    }[];
    security?: SecurityHeader;
    endpoints: Endpoint[];
}
export interface Config {
    paramSerializationStrategy: {
        query: {
            array: QueryParamArrayStrategy;
        };
    };
}
export interface SecurityHeader {
    name: string;
    description?: string;
    type: Type;
}
export interface Endpoint {
    name: string;
    description?: string;
    tags: string[];
    method: HttpMethod;
    path: string;
    request?: Request;
    responses: Response[];
    defaultResponse?: DefaultResponse;
    draft: boolean;
}
export interface Request {
    headers: Header[];
    pathParams: PathParam[];
    queryParams: QueryParam[];
    body?: Body;
}
export interface Response {
    status: number;
    description?: string;
    headers: Header[];
    body?: Body;
}
export declare type DefaultResponse = Omit<Response, "status">;
export interface Header {
    name: string;
    description?: string;
    type: Type;
    optional: boolean;
    examples?: Example[];
}
export interface PathParam {
    name: string;
    description?: string;
    type: Type;
    examples?: Example[];
}
export interface Example {
    name: string;
    value: any;
}
export interface QueryParam {
    name: string;
    description?: string;
    type: Type;
    optional: boolean;
    examples?: Example[];
}
export interface Body {
    type: Type;
}
/**
 * Supported serialization strategies for arrays in query parameters
 *
 *    "ampersand": ?id=3&id=4&id=5
 *    "comma": ?id=3,4,5
 */
export declare type QueryParamArrayStrategy = "ampersand" | "comma";
/** Supported HTTP methods */
export declare type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
/** Type guards */
export declare function isSpecificResponse(response: DefaultResponse): response is Response;
