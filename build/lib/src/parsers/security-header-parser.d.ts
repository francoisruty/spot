import { PropertyDeclaration } from "ts-morph";
import { SecurityHeader } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { TypeTable } from "../types";
import { Result } from "../util";
export declare function parseSecurityHeader(property: PropertyDeclaration, typeTable: TypeTable, lociTable: LociTable): Result<SecurityHeader, ParserError>;
