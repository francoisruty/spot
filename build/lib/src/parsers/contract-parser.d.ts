import { SourceFile } from "ts-morph";
import { Contract } from "../definitions";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { Result } from "../util";
/**
 * Parse a root source file to return a contract.
 */
export declare function parseContract(file: SourceFile): Result<{
    contract: Contract;
    lociTable: LociTable;
}, ParserError>;
