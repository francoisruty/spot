export declare class ParserError extends Error {
    readonly message: string;
    readonly locations: {
        file: string;
        position: number;
    }[];
    constructor(message: string, ...locations: {
        file: string;
        position: number;
    }[]);
}
export declare class OptionalNotAllowedError extends ParserError {
}
export declare class TypeNotAllowedError extends ParserError {
}
