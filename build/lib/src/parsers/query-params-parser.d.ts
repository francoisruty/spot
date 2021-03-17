import { ParameterDeclaration } from "ts-morph";
import { QueryParam } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { TypeTable } from "../types";
import { Result } from "../util";
export declare function parseQueryParams(parameter: ParameterDeclaration, typeTable: TypeTable, lociTable: LociTable): Result<QueryParam[], ParserError>;
