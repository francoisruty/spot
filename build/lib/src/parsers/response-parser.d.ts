import { MethodDeclaration } from "ts-morph";
import { Response } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { TypeTable } from "../types";
import { Result } from "../util";
export declare function parseResponse(method: MethodDeclaration, typeTable: TypeTable, lociTable: LociTable): Result<Response, ParserError>;
