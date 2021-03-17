import { InterfaceDeclaration, TypeAliasDeclaration, TypeNode, TypeReferenceNode } from "ts-morph";
import { ParserError } from "../errors";
import { LociTable } from "../locations";
import { Type, TypeTable } from "../types";
import { Result } from "../util";
export declare function parseType(typeNode: TypeNode, typeTable: TypeTable, lociTable: LociTable): Result<Type, ParserError>;
/**
 * Extract the target type alias declaration or interface declaration
 * of a type reference.
 *
 * @param typeReference AST type reference node
 */
export declare function getTargetDeclarationFromTypeReference(typeReference: TypeReferenceNode): Result<TypeAliasDeclaration | InterfaceDeclaration, ParserError>;
