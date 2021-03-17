/**
 * `KeyOfType` returns keys of type `KeyType` from type `T`. It is similar
 * to TypeScript's `keyof` but additionally constrains by key type.
 */
export declare type KeyOfType<T, KeyType> = {
    [P in keyof Required<T>]: Required<T>[P] extends KeyType ? P : never;
}[keyof T];
/**
 * `PickByType` creates a new type with properties from type `T` which
 * extend type `KeyType`. It is similar to TypeScript's `Pick` but selecting
 * by key type instead of key names
 */
export declare type PickByType<T, KeyType> = Pick<T, Extract<keyof T, KeyOfType<T, KeyType>>>;
/**
 * `OmitByType` creates a new type without properties from type `T` which
 * extend type `KeyType`. It is similar to TypeScript's `Omit` but selecting
 * by key type instead of key name.
 */
export declare type OmitByType<T, KeyType> = Pick<T, Exclude<keyof T, KeyOfType<T, KeyType>>>;
/**
 * Result mimics the Rust's result type
 */
export declare type Result<T, E extends Error> = Ok<T> | Err<E>;
declare type NotError<T> = T extends Error ? never : T;
export declare function isOk<T, E extends Error>(result: Result<T, E>): result is Ok<T>;
export declare function isErr<T, E extends Error>(result: Result<T, E>): result is Err<E>;
export declare function ok<T>(value: NotError<T>): Ok<T>;
export declare function err<E extends Error>(error: E): Err<E>;
export declare function tryCatch<T, E extends Error>(op: () => NotError<T>): Result<T, E>;
declare class Ok<T> {
    private value;
    constructor(value: T);
    isOk(): this is Ok<T>;
    isErr(): boolean;
    unwrap(): T;
    /**
     * Used mostly with tests
     */
    unwrapOrThrow(): T;
    /**
     * Used mostly with tests
     */
    unwrapErrOrThrow(): never;
}
declare class Err<E extends Error> {
    private value;
    constructor(value: E);
    isOk(): boolean;
    isErr(): this is Err<E>;
    unwrapErr(): E;
    /**
     * Used mostly with tests
     */
    unwrapOrThrow(): never;
    /**
     * Used mostly with tests
     */
    unwrapErrOrThrow(): E;
}
export {};
