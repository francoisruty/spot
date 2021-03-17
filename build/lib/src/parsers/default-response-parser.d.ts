import { MethodDeclaration } from "ts-morph";
import { DefaultResponse } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { TypeTable } from "../types";
import { Result } from "../util";
export declare function parseDefaultResponse(method: MethodDeclaration, typeTable: TypeTable, lociTable: LociTable): Result<DefaultResponse, ParserError>;
