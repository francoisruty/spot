export declare enum TypeKind {
    NULL = "null",
    BOOLEAN = "boolean",
    BOOLEAN_LITERAL = "boolean-literal",
    STRING = "string",
    STRING_LITERAL = "string-literal",
    FLOAT = "float",
    DOUBLE = "double",
    FLOAT_LITERAL = "float-literal",
    INT32 = "int32",
    INT64 = "int64",
    INT_LITERAL = "integer-literal",
    DATE = "date",
    DATE_TIME = "date-time",
    OBJECT = "object",
    ARRAY = "array",
    UNION = "union",
    REFERENCE = "reference",
    INTERSECTION = "intersection"
}
export declare type Type = NullType | BooleanType | BooleanLiteralType | StringType | StringLiteralType | FloatType | DoubleType | FloatLiteralType | Int32Type | Int64Type | IntLiteralType | DateType | DateTimeType | ObjectType | ArrayType | UnionType | ReferenceType | IntersectionType;
/**
 * A concrete type is any type that is not a union of types, intersection or reference to a type.
 */
export declare type ConcreteType = Exclude<Type, UnionType | ReferenceType | IntersectionType>;
/**
 * A primitive type is any type that is not an object, array, union, reference or intersection
 */
export declare type PrimitiveType = Exclude<Type, ObjectType | ArrayType | UnionType | ReferenceType | IntersectionType>;
export declare type LiteralType = BooleanLiteralType | StringLiteralType | FloatLiteralType | IntLiteralType;
export interface NullType {
    kind: TypeKind.NULL;
}
export interface BooleanType {
    kind: TypeKind.BOOLEAN;
}
export interface BooleanLiteralType {
    kind: TypeKind.BOOLEAN_LITERAL;
    value: boolean;
}
export interface StringType {
    kind: TypeKind.STRING;
}
export interface StringLiteralType {
    kind: TypeKind.STRING_LITERAL;
    value: string;
}
export interface FloatType {
    kind: TypeKind.FLOAT;
}
export interface DoubleType {
    kind: TypeKind.DOUBLE;
}
export interface FloatLiteralType {
    kind: TypeKind.FLOAT_LITERAL;
    value: number;
}
export interface Int32Type {
    kind: TypeKind.INT32;
}
export interface Int64Type {
    kind: TypeKind.INT64;
}
export interface IntLiteralType {
    kind: TypeKind.INT_LITERAL;
    value: number;
}
export interface DateType {
    kind: TypeKind.DATE;
}
export interface DateTimeType {
    kind: TypeKind.DATE_TIME;
}
export interface ObjectPropertiesType {
    name: string;
    description?: string;
    optional: boolean;
    type: Type;
}
export interface ObjectType {
    kind: TypeKind.OBJECT;
    properties: Array<ObjectPropertiesType>;
}
export interface ArrayType {
    kind: TypeKind.ARRAY;
    elementType: Type;
}
export interface UnionType {
    kind: TypeKind.UNION;
    types: Type[];
    discriminator?: string;
}
export interface IntersectionType {
    kind: TypeKind.INTERSECTION;
    types: Type[];
}
export interface ReferenceType {
    kind: TypeKind.REFERENCE;
    name: string;
}
export declare function nullType(): NullType;
export declare function booleanType(): BooleanType;
export declare function booleanLiteralType(value: boolean): BooleanLiteralType;
export declare function stringType(): StringType;
export declare function stringLiteralType(value: string): StringLiteralType;
export declare function floatType(): FloatType;
export declare function doubleType(): DoubleType;
export declare function floatLiteralType(value: number): FloatLiteralType;
export declare function int32Type(): Int32Type;
export declare function int64Type(): Int64Type;
export declare function intLiteralType(value: number): IntLiteralType;
export declare function dateType(): DateType;
export declare function dateTimeType(): DateTimeType;
export declare function objectType(properties: ObjectPropertiesType[]): ObjectType;
export declare function arrayType(elementType: Type): ArrayType;
export declare function unionType(unionTypes: Type[], discriminator?: string): UnionType;
export declare function intersectionType(intersectionTypes: Type[]): IntersectionType;
export declare function referenceType(name: string): ReferenceType;
export declare function isNullType(type: Type): type is NullType;
export declare function isNotNullType<T extends Type>(type: T): type is Exclude<T, NullType>;
export declare function isBooleanType(type: Type): type is BooleanType;
export declare function isBooleanLiteralType(type: Type): type is BooleanLiteralType;
export declare function areBooleanLiteralTypes(types: Type[]): types is BooleanLiteralType[];
export declare function isStringType(type: Type): type is StringType;
export declare function isNotStringType<T extends Type>(type: T): type is Exclude<T, StringType>;
export declare function isStringLiteralType(type: Type): type is StringLiteralType;
export declare function areStringLiteralTypes(types: Type[]): types is StringLiteralType[];
export declare function isFloatType(type: Type): type is FloatType;
export declare function isDoubleType(type: Type): type is DoubleType;
export declare function isFloatLiteralType(type: Type): type is FloatLiteralType;
export declare function areFloatLiteralTypes(types: Type[]): types is FloatLiteralType[];
export declare function isInt32Type(type: Type): type is Int32Type;
export declare function isInt64Type(type: Type): type is Int64Type;
export declare function isIntLiteralType(type: Type): type is IntLiteralType;
export declare function areIntLiteralTypes(types: Type[]): types is IntLiteralType[];
export declare function areIntOrIntLiteralTypes(types: Type[]): types is Array<IntLiteralType | Int32Type | Int64Type>;
export declare function areStringOrStringLiteralTypes(types: Type[]): types is Array<StringLiteralType | StringType>;
export declare function areFloatOrFloatLiteralTypes(types: Type[]): types is Array<FloatLiteralType | FloatType>;
export declare function areBooleanOrBooleanLiteralTypes(types: Type[]): types is Array<BooleanLiteralType | BooleanType>;
export declare function isDateType(type: Type): type is DateType;
export declare function isDateTimeType(type: Type): type is DateTimeType;
export declare function isObjectType(type: Type): type is ObjectType;
export declare function isArrayType(type: Type): type is ArrayType;
export declare function isUnionType(type: Type): type is UnionType;
export declare function isIntersectionType(type: Type): type is IntersectionType;
export declare function isReferenceType(type: Type): type is ReferenceType;
export declare function isPrimitiveType(type: Type): type is PrimitiveType;
export declare function isLiteralType(type: Type): type is LiteralType;
export declare function isNotLiteralType<T extends Type>(type: T): type is Exclude<T, LiteralType>;
export declare function possibleRootTypes(type: Type, typeTable: TypeTable): ConcreteType[];
export declare function dereferenceType(type: Type, typeTable: TypeTable): Exclude<Type, ReferenceType>;
/**
 * Given a list of types, try to find a disriminator. The null type is ignored.
 *
 * @param types list of types
 * @param typeTable a TypeTable
 */
export declare function inferDiscriminator(types: Type[], typeTable: TypeTable): string | undefined;
/**
 * Given a list of types, if any property exists as both a string and
 * string literal on an intersection, then resolve it to the narrowest type
 *
 * @param types list of types
 */
export declare function resolveIntersectionToNarrowestType(types: Array<ObjectType>): Array<ObjectType>;
/**
 * Given a list of types, try to find if the intersection evaluates to
 * a `never` type
 *
 * @param types list of types
 * @param typeTable a TypeTable
 */
export declare function doesInterfaceEvaluatesToNever(types: Array<Type>, typeTable: TypeTable): boolean;
/**
 * Loci table is a lookup table for types.
 */
export declare class TypeTable {
    /**
     * Retrieve the number of entries in the type table.
     */
    get size(): number;
    static fromArray(typeTableArr: {
        name: string;
        typeDef: TypeDef;
    }[]): TypeTable;
    private typeDefs;
    constructor(types?: Map<string, TypeDef>);
    /**
     * Return an object representation of the type table.
     */
    toArray(): {
        name: string;
        typeDef: TypeDef;
    }[];
    /**
     * Add a type to the type table. If the type key is already present, `add` will throw an error.
     *
     * @param key lookup key
     * @param typeDef target type definition
     */
    add(key: string, typeDef: TypeDef): void;
    /**
     * Retrieve a type by lookup key.
     *
     * @param key lookup key
     */
    get(key: string): TypeDef | undefined;
    /**
     * Retrieve a type by lookup key.
     *
     * @param key lookup key
     */
    getOrError(key: string): TypeDef;
    /**
     * Check if a type exists in the table.
     *
     * @param key lookup key
     */
    exists(key: string): boolean;
}
export interface TypeDef {
    type: Type;
    description?: string;
}
