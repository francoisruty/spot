import { JSDoc } from "ts-morph";
import { Type } from "../types";
import { Result } from "../util";
import { Example } from "../definitions";
import { ParserError } from "../errors";
export declare function extractJSDocExamples(jsDoc: JSDoc | undefined, type: Type): Result<Example[], ParserError> | undefined;
