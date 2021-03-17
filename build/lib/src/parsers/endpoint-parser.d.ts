import { ClassDeclaration } from "ts-morph";
import { Endpoint } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { TypeTable } from "../types";
import { Result } from "../util";
export declare function parseEndpoint(klass: ClassDeclaration, typeTable: TypeTable, lociTable: LociTable): Result<Endpoint, ParserError>;
