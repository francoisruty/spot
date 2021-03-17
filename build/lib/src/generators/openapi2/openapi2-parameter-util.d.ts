import { Config, Header, PathParam, QueryParam } from "../../definitions";
import { TypeTable } from "../../types";
import { HeaderObject, HeaderParameterObject, PathParameterObject, QueryParameterObject } from "./openapi2-specification";
export declare function pathParamToPathParameterObject(pathParam: PathParam, typeTable: TypeTable): PathParameterObject;
export declare function requestHeaderToHeaderParameterObject(header: Header, typeTable: TypeTable): HeaderParameterObject;
export declare function queryParamToQueryParameterObject(queryParam: QueryParam, typeTable: TypeTable, config: Config): QueryParameterObject;
export declare function responseHeaderToHeaderObject(header: Header, typeTable: TypeTable): HeaderObject;
