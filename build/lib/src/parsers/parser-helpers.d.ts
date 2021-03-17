import { ArrayLiteralExpression, ClassDeclaration, Decorator, JSDoc, JSDocableNode, MethodDeclaration, NumericLiteral, ObjectLiteralExpression, ParameterDeclaration, PropertyAssignment, PropertyDeclaration, PropertySignature, SourceFile, StringLiteral, TypeNode } from "ts-morph";
import { HttpMethod, QueryParamArrayStrategy } from "../definitions";
/**
 * Retrieve all local dependencies of a file recursively including itself.
 *
 * @param file the source file
 * @param visitedFiles visisted files
 */
export declare function getSelfAndLocalDependencies(file: SourceFile, visitedFiles?: SourceFile[]): SourceFile[];
/**
 * Retrieve a class from a file with a particular decorator or throw.
 *
 * @param file the source file
 * @param decoratorName name of decorator to search for
 */
export declare function getClassWithDecoratorOrThrow(file: SourceFile, decoratorName: string): ClassDeclaration;
/**
 * Retrieve a property from a class declaration with a particular decorator.
 *
 * @param klass class declaration
 * @param decoratorName name of decorator to search for
 */
export declare function getPropertyWithDecorator(klass: ClassDeclaration, decoratorName: string): PropertyDeclaration | undefined;
/**
 * Retrieve a method from a class declaration with a particular decorator.
 *
 * @param klass class declaration
 * @param decoratorName  name of the decorator to search for
 */
export declare function getMethodWithDecorator(klass: ClassDeclaration, decoratorName: string): MethodDeclaration | undefined;
/**
 * Retrieve a parameter from a method declaration with a particular decorator.
 *
 * @param method method declaration
 * @param decoratorName name of decorator to search for
 */
export declare function getParamWithDecorator(method: MethodDeclaration, decoratorName: string): ParameterDeclaration | undefined;
/**
 * Retrieve a parameter's property signatures or throw.
 *
 * @param parameter a parameter declaration
 */
export declare function getParameterPropertySignaturesOrThrow(parameter: ParameterDeclaration): PropertySignature[];
export declare function parseTypeReferencePropertySignaturesOrThrow(typeNode: TypeNode): PropertySignature[];
/**
 * Retrieve a decorator factory's configuration. The configuration is
 * the first parameter of the decorator and is expected to be an object
 * literal.
 *
 * @param decorator the source decorator
 */
export declare function getDecoratorConfigOrThrow(decorator: Decorator): ObjectLiteralExpression;
/**
 * Retrieves a property from an object literal expression. If provided,
 * the generic parameter will narrow down the available property names
 * allowed.
 *
 * @param objectLiteral a ts-morph object literal expression
 * @param propertyName name of the property
 */
export declare function getObjLiteralProp<T>(objectLiteral: ObjectLiteralExpression, propertyName: Extract<keyof T, string>): PropertyAssignment | undefined;
/**
 * Retrieves a property from an object literal expression or error. If
 * provided, the generic parameter will narrow down the available
 * property names allowed.
 *
 * @param objectLiteral a ts-morph object literal expression
 * @param propertyName name of the property
 */
export declare function getObjLiteralPropOrThrow<T>(objectLiteral: ObjectLiteralExpression, propertyName: Extract<keyof T, string>): PropertyAssignment;
/**
 * Retrieve a property's value as a string or error.
 *
 * @param property the source property
 */
export declare function getPropValueAsStringOrThrow(property: PropertyAssignment): StringLiteral;
/**
 * Retrieve a property's value as a number or error.
 *
 * @param property the source property
 */
export declare function getPropValueAsNumberOrThrow(property: PropertyAssignment): NumericLiteral;
/**
 * Retrieve a property's value as an array or error.
 *
 * @param property the source property
 */
export declare function getPropValueAsArrayOrThrow(property: PropertyAssignment): ArrayLiteralExpression;
/**
 * Retrieve a property's value as an object or error.
 *
 * @param property the source property
 */
export declare function getPropValueAsObjectOrThrow(property: PropertyAssignment): ObjectLiteralExpression;
/**
 * Retrieve a property's name. This will remove any quotes surrounding the name.
 *
 * @param property property signature
 */
export declare function getPropertyName(property: PropertyDeclaration | PropertySignature): string;
/**
 * Retrieve a JSDoc for a ts-morph node. The node is expected
 * to have no more than one JSDoc.
 *
 * @param node a JSDocable ts-morph node
 */
export declare function getJsDoc(node: JSDocableNode): JSDoc | undefined;
/**
 * Determine if a HTTP method is a supported HttpMethod.
 *
 * @param method the method to check
 */
export declare function isHttpMethod(method: string): method is HttpMethod;
/**
 * Determine if a query param array strategy is a supported QueryParamArrayStrategy.
 *
 * @param strategy the strategy to check
 */
export declare function isQueryParamArrayStrategy(strategy: string): strategy is QueryParamArrayStrategy;
