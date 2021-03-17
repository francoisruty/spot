import { ClassDeclaration } from "ts-morph";
import { Config } from "../definitions";
import { ParserError } from "../errors";
import { Result } from "../util";
export declare function parseConfig(klass: ClassDeclaration): Result<Config, ParserError>;
export declare function defaultConfig(): Config;
