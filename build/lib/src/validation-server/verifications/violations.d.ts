/**
 * Violations are used as part of the validation server payload to
 * express contract violations.
 */
import { PathParamTypeDisparityViolation, QueryParamTypeDisparityViolation, RequestBodyTypeDisparityViolation, RequestHeaderTypeDisparityViolation, RequiredQueryParamMissingViolation, RequiredRequestHeaderMissingViolation, RequiredResponseHeaderMissingViolation, ResponseBodyTypeDisparityViolation, ResponseHeaderTypeDisparityViolation, UndefinedEndpointResponseViolation, UndefinedEndpointViolation, UndefinedQueryParamViolation, UndefinedRequestBodyViolation, UndefinedRequestHeaderViolation, UndefinedResponseBodyViolation, UndefinedResponseHeaderViolation } from "../spots/validate";
export declare function undefinedEndpointViolation(message: string): UndefinedEndpointViolation;
export declare function undefinedEndpointResponseViolation(message: string): UndefinedEndpointResponseViolation;
export declare function requiredRequestHeaderMissingViolation(message: string): RequiredRequestHeaderMissingViolation;
export declare function undefinedRequestHeaderViolation(message: string): UndefinedRequestHeaderViolation;
export declare function requestHeaderTypeDisparityViolation(message: string, typeDisparities: string[]): RequestHeaderTypeDisparityViolation;
export declare function pathParamTypeDisparityViolation(message: string, typeDisparities: string[]): PathParamTypeDisparityViolation;
export declare function requiredQueryParamMissingViolation(message: string): RequiredQueryParamMissingViolation;
export declare function undefinedQueryParamViolation(message: string): UndefinedQueryParamViolation;
export declare function queryParamTypeDisparityViolation(message: string, typeDisparities: string[]): QueryParamTypeDisparityViolation;
export declare function undefinedRequestBodyViolation(message: string): UndefinedRequestBodyViolation;
export declare function requestBodyTypeDisparityViolation(message: string, typeDisparities: string[]): RequestBodyTypeDisparityViolation;
export declare function requiredResponseHeaderMissingViolation(message: string): RequiredResponseHeaderMissingViolation;
export declare function undefinedResponseHeaderViolation(message: string): UndefinedResponseHeaderViolation;
export declare function responseHeaderTypeDisparityViolation(message: string, typeDisparities: string[]): ResponseHeaderTypeDisparityViolation;
export declare function undefinedResponseBodyViolation(message: string): UndefinedResponseBodyViolation;
export declare function responseBodyTypeDisparityViolation(message: string, typeDisparities: string[]): ResponseBodyTypeDisparityViolation;
