import { MethodDeclaration } from "ts-morph";
import { Request } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { TypeTable } from "../types";
import { Result } from "../util";
export declare function parseRequest(method: MethodDeclaration, typeTable: TypeTable, lociTable: LociTable): Result<Request, ParserError>;
