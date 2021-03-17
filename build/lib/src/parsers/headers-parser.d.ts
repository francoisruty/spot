import { ParameterDeclaration } from "ts-morph";
import { Header } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { TypeTable } from "../types";
import { Result } from "../util";
export declare function parseHeaders(parameter: ParameterDeclaration, typeTable: TypeTable, lociTable: LociTable): Result<Header[], ParserError>;
