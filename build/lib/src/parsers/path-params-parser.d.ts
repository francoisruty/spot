import { ParameterDeclaration } from "ts-morph";
import { PathParam } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { TypeTable } from "../types";
import { Result } from "../util";
export declare function parsePathParams(parameter: ParameterDeclaration, typeTable: TypeTable, lociTable: LociTable): Result<PathParam[], ParserError>;
