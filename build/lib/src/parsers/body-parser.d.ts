import { ParameterDeclaration } from "ts-morph";
import { Body } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { TypeTable } from "../types";
import { Result } from "../util";
export declare function parseBody(parameter: ParameterDeclaration, typeTable: TypeTable, lociTable: LociTable): Result<Body, ParserError>;
