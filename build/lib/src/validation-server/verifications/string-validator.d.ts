import { ArrayType, ObjectType, ReferenceType, Type, TypeTable } from "../../types";
export interface StringInput {
    name: string;
    value: string | {
        [key: string]: unknown;
    } | unknown[];
}
export declare class StringValidator {
    static getErrorMessage(input: string, type: Exclude<Type, ObjectType | ArrayType | ReferenceType>): string;
    messages: string[];
    typeTable: TypeTable;
    constructor(typeTable: TypeTable);
    run(input: StringInput, type: Type, isMandatory?: boolean): boolean | never;
    private validateWithValidator;
    private validateObject;
    private validateArray;
}
